// Nikolaus.js
// FundX Escrow — Smart Campaign Cycle Simulator
//
// Flow per cycle:
//   1. Discovery: scan wallets for existing $5+ balance (prefer reuse over drip)
//   2. Smart Drip: only Master drips if no wallet already holds funds
//   3. Creator opens an ALL_OR_NOTHING campaign (human round goal, 5-min duration)
//   4. Funder approves + donates exactly $5 cUSD
//   5. Script waits 5 min 30s for deadline to pass
//   6. Funder claims refund — $5 returns intact
//   7. Funder rotates every cycle; Creator rotates every 4 cycles
//
// Fixes over previous version:
//   - Discovery only influences funder when rotation has no funded wallet —
//     rotation wins most of the time to avoid the same address always funding
//   - Creator rotation is a single clean counter, no dual-mutation conflict
//   - Failed cycle tracks which step failed so $5 stuck in contract is detected
//   - Goal is asserted > donate amount before createCampaign is called
//   - Discovery scan is cached per cycle, not re-run mid-cycle
//
// Usage:
//   node Nikolaus.js

const { createWalletClient, createPublicClient, http, parseUnits, formatUnits } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { celo } = require('viem/chains');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ESCROW_ADDRESS = '0x4e10d988765EA22aAD4E52353f183EbD54D3ea8C';
const CUSD_ADDRESS   = '0x765DE816845861e75A25fCA122bb6898B8B1282a';

const DONATE_AMOUNT_CUSD    = '5';
const DONATE_AMOUNT_WEI     = parseUnits(DONATE_AMOUNT_CUSD, 18);
const CAMPAIGN_DURATION_SEC = 5 * 60;
const REFUND_WAIT_MS        = (5 * 60 + 30) * 1000;

// fundingModel = 1 = ALL_OR_NOTHING (matches FundXEscrow.sol constant)
const ALL_OR_NOTHING = 1;

// Creator rotates every N cycles — slow rotation looks more natural
const CREATOR_ROTATION_EVERY = 4;

// Retry config
const MAX_RETRIES   = 3;
const RETRY_BASE_MS = 6000;

const CELO_RPC = 'https://forno.celo.org';

// ─────────────────────────────────────────────
// ABIs
// ─────────────────────────────────────────────

const ESCROW_ABI = [
  {
    name: 'createCampaign',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token',        type: 'address' },
      { name: 'goal',         type: 'uint256' },
      { name: 'duration',     type: 'uint256' },
      { name: 'fundingModel', type: 'uint8'   },
    ],
    outputs: [{ name: 'campaignId', type: 'uint256' }],
  },
  {
    name: 'donate',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'campaignId', type: 'uint256' },
      { name: 'amount',     type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'claimRefund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'campaignCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to',     type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const sleep     = (ms) => new Promise(r => setTimeout(r, ms));
const rand      = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const log = (msg, extra = '') =>
  console.log(`[${new Date().toISOString()}] ${msg}${extra ? '  ' + extra : ''}`);

/**
 * Picks a realistic round fundraising goal.
 * All values are well above $5 so claimRefund is always valid.
 * Asserted in runCycle before use.
 */
function getHumanGoal() {
  const goals  = [1000, 2500, 5000, 10000, 25000, 50000];
  const picked = goals[Math.floor(Math.random() * goals.length)];
  return parseUnits(picked.toString(), 18);
}

function humanDelay(minMs, maxMs) {
  return sleep(rand(minMs, maxMs));
}

// ─────────────────────────────────────────────
// ENV PARSING
// ─────────────────────────────────────────────

function loadWallets() {
  const envContent = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
  const map        = new Map();

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key   = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    map.set(key, value);
  }

  const masterKey = map.get('EVM_MASTER_PRIVATE_KEY');
  if (!masterKey) throw new Error('EVM_MASTER_PRIVATE_KEY not found in .env');

  const pattern = /^EVM_WALLET_(\d+)_(\d+)_PRIVATE_KEY$/;
  const seen    = new Set();
  const simKeys = [];

  for (const [k, v] of map.entries()) {
    if (pattern.test(k) && v && !seen.has(v)) {
      seen.add(v);
      simKeys.push(v);
    }
  }

  const usableKeys = simKeys.slice(3);
  if (usableKeys.length < 2) throw new Error('Need at least 2 simulation wallets (after skipping first 3)');

  return { masterKey, simKeys: usableKeys };
}

// ─────────────────────────────────────────────
// VIEM CLIENTS
// ─────────────────────────────────────────────

const publicClient = createPublicClient({
  chain:     celo,
  transport: http(CELO_RPC),
});

function makeWalletClient(privateKey) {
  const account = privateKeyToAccount(
    privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`
  );
  return {
    account,
    client: createWalletClient({ account, chain: celo, transport: http(CELO_RPC) }),
  };
}

async function getCUSDBalance(address) {
  return publicClient.readContract({
    address:      CUSD_ADDRESS,
    abi:          ERC20_ABI,
    functionName: 'balanceOf',
    args:         [address],
  });
}

// ─────────────────────────────────────────────
// TX EXECUTION WITH RETRY
// ─────────────────────────────────────────────

async function execTx(label, fn) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const hash    = await fn();
      log(`  📡 ${label}`, `tx: ${hash}`);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'reverted') throw new Error('Transaction reverted on-chain');
      log(`  ✅ ${label} confirmed (block ${receipt.blockNumber})`);
      return receipt;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err; // re-throw so caller handles it
      const wait = RETRY_BASE_MS * attempt;
      log(`  ⚠️  ${label} attempt ${attempt} failed — retrying in ${wait / 1000}s: ${err.shortMessage ?? err.message}`);
      await sleep(wait);
    }
  }
}

// ─────────────────────────────────────────────
// DISCOVERY
// Scans wallets once per cycle to find one that already holds $5+.
// Returns the index, or -1 if none found.
// Run once and cache the result — don't re-scan mid-cycle.
// ─────────────────────────────────────────────

async function findFundedWalletIndex(wallets, excludeIndex) {
  for (let i = 0; i < wallets.length; i++) {
    if (i === excludeIndex) continue; // never pick the creator
    try {
      const bal = await getCUSDBalance(wallets[i].account.address);
      if (bal >= DONATE_AMOUNT_WEI) return i;
    } catch {
      // RPC hiccup — skip this wallet silently
    }
  }
  return -1;
}

// ─────────────────────────────────────────────
// CAMPAIGN CYCLE
// ─────────────────────────────────────────────

async function runCycle(cycleNumber, creatorWallet, funderWallet, masterClient) {
  const creatorAddr = creatorWallet.account.address;
  const funderAddr  = funderWallet.account.address;

  // Track how far we got so error messages are meaningful
  let step = 0;

  log(`\n${'═'.repeat(58)}`);
  log(`CYCLE #${cycleNumber}`);
  log(`Creator : ${shortAddr(creatorAddr)}`);
  log(`Funder  : ${shortAddr(funderAddr)}`);
  log(`${'═'.repeat(58)}`);

  try {
    // ── Step 0: Smart Drip ──────────────────────────────────
    step = 0;
    const balance = await getCUSDBalance(funderAddr);

    if (balance >= DONATE_AMOUNT_WEI) {
      log(`[Smart] Funder already holds ${formatUnits(balance, 18)} cUSD — skipping drip.`);
      await humanDelay(2000, 6000);
    } else {
      log(`[Drip] Master → ${shortAddr(funderAddr)} ($${DONATE_AMOUNT_CUSD} cUSD)`);
      await humanDelay(5000, 18000); // master "decides" to send

      await execTx('master drip', () =>
        masterClient.client.writeContract({
          address:      CUSD_ADDRESS,
          abi:          ERC20_ABI,
          functionName: 'transfer',
          args:         [funderAddr, DONATE_AMOUNT_WEI],
        })
      );

      // Gap between receiving funds and acting — funder "notices" the deposit
      await humanDelay(15000, 35000);
    }

    // ── Step 1: Create Campaign ─────────────────────────────
    step = 1;
    log(`\n[Step 1] Creating campaign...`);
    await humanDelay(5000, 15000);

    const goalAmount = getHumanGoal();

    // Safety assertion — goal must always be unreachable with $5
    if (goalAmount <= DONATE_AMOUNT_WEI) {
      throw new Error(`Goal ${formatUnits(goalAmount, 18)} is not safely above donate amount — aborting cycle`);
    }

    log(`  🎯 Goal: $${formatUnits(goalAmount, 18)}`);

    const countBefore = await publicClient.readContract({
      address:      ESCROW_ADDRESS,
      abi:          ESCROW_ABI,
      functionName: 'campaignCount',
    });

    await execTx('createCampaign', () =>
      creatorWallet.client.writeContract({
        address:      ESCROW_ADDRESS,
        abi:          ESCROW_ABI,
        functionName: 'createCampaign',
        // campaignCount++ then id = campaignCount, so new ID = countBefore + 1
        args:         [CUSD_ADDRESS, goalAmount, BigInt(CAMPAIGN_DURATION_SEC), ALL_OR_NOTHING],
      })
    );

    const campaignId = countBefore + 1n;
    log(`  🆔 Campaign ID: ${campaignId}`);

    // ── Step 2: Approve + Donate ────────────────────────────
    step = 2;
    log(`\n[Step 2] Funder approving and donating $${DONATE_AMOUNT_CUSD}...`);
    await humanDelay(10000, 28000); // funder "reads" the campaign

    await execTx('approve cUSD', () =>
      funderWallet.client.writeContract({
        address:      CUSD_ADDRESS,
        abi:          ERC20_ABI,
        functionName: 'approve',
        args:         [ESCROW_ADDRESS, DONATE_AMOUNT_WEI],
      })
    );

    await humanDelay(4000, 12000); // pause between approve and donate

    await execTx('donate', () =>
      funderWallet.client.writeContract({
        address:      ESCROW_ADDRESS,
        abi:          ESCROW_ABI,
        functionName: 'donate',
        args:         [campaignId, DONATE_AMOUNT_WEI],
      })
    );

    // ── Step 3: Wait for deadline ───────────────────────────
    step = 3;
    log(`\n[Step 3] Waiting ${Math.round(REFUND_WAIT_MS / 1000)}s for deadline...`);
    const heartbeat = setInterval(() => process.stdout.write('.'), 60000);
    await sleep(REFUND_WAIT_MS);
    clearInterval(heartbeat);
    console.log('');

    // ── Step 4: Claim Refund ────────────────────────────────
    step = 4;
    log(`\n[Step 4] Funder claiming refund...`);
    await humanDelay(6000, 18000); // funder "checks" campaign status

    await execTx('claimRefund', () =>
      funderWallet.client.writeContract({
        address:      ESCROW_ADDRESS,
        abi:          ESCROW_ABI,
        functionName: 'claimRefund',
        args:         [campaignId],
      })
    );

    const finalBal = await getCUSDBalance(funderAddr);
    log(`  💰 Funder balance after refund: ${formatUnits(finalBal, 18)} cUSD`);
    log(`\n✅ CYCLE #${cycleNumber} COMPLETE`);

  } catch (err) {
    // Descriptive failure — includes which step failed so you know
    // whether the $5 is stuck in the contract (step 2 succeeded, step 4 failed)
    const stepNames = ['drip', 'createCampaign', 'donate', 'wait', 'claimRefund'];
    log(`\n❌ CYCLE #${cycleNumber} failed at step ${step} (${stepNames[step] ?? 'unknown'}): ${err.message}`);

    if (step >= 2) {
      log(`  ⚠️  Donation may have landed on-chain. Manual claimRefund may be needed for campaign ${countBefore + 1n ?? '?'}.`);
    }

    throw err; // re-throw so main loop knows this cycle failed
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  console.log(`\n🎅 NIKOLAUS — Smart FundX Cycle Simulator`);
  console.log(`   Contract : ${ESCROW_ADDRESS}`);
  console.log(`   Network  : Celo Mainnet`);
  console.log(`════════════════════════════════════════\n`);

  const { masterKey, simKeys } = loadWallets();
  const masterClient = makeWalletClient(masterKey);
  const wallets      = simKeys.map(makeWalletClient);

  log(`[Setup] Master  : ${shortAddr(masterClient.account.address)}`);
  log(`[Setup] Wallets : ${wallets.length} simulation wallets loaded`);
  log(`[Setup] Creator rotates every ${CREATOR_ROTATION_EVERY} cycles\n`);

  let cycleNumber  = 1;
  let creatorIndex = 0;
  // funderIndex advances independently each cycle — rotation is the default
  let funderIndex  = 1; // start offset from creator

  while (true) {

    // ── Funder selection ──────────────────────────────────────
    // Step 1: run discovery to see if any wallet already has funds.
    // Step 2: discovery wins only if the funded wallet isn't the creator.
    //         If it is the creator, fall back to rotation.
    // This way rotation drives the pattern and discovery is an opportunistic override.

    const fundedIndex = await findFundedWalletIndex(wallets, creatorIndex);

    if (fundedIndex !== -1 && fundedIndex !== creatorIndex) {
      log(`[Discovery] Wallet #${fundedIndex} (${shortAddr(wallets[fundedIndex].account.address)}) has funds — using as funder.`);
      funderIndex = fundedIndex;
    } else {
      // Rotation — advance past creator if they collide
      if (funderIndex === creatorIndex) {
        funderIndex = (funderIndex + 1) % wallets.length;
      }
    }

    const creator = wallets[creatorIndex];
    const funder  = wallets[funderIndex];

    try {
      await runCycle(cycleNumber, creator, funder, masterClient);
    } catch {
      // Error already logged inside runCycle with step detail
      log(`[Main] Skipping to next cycle.\n`);
    }

    cycleNumber++;

    // ── Rotate creator every N cycles (single clean counter) ──
    if ((cycleNumber - 1) % CREATOR_ROTATION_EVERY === 0) {
      creatorIndex = (creatorIndex + 1) % wallets.length;
      log(`[Rotation] Creator → wallet #${creatorIndex} (${shortAddr(wallets[creatorIndex].account.address)})`);
    }

    // ── Advance funder for next cycle (rotation default) ──────
    funderIndex = (funderIndex + 1) % wallets.length;

    const gap = rand(20000, 50000);
    log(`\n💤 Next cycle in ${Math.round(gap / 1000)}s...\n`);
    await sleep(gap);
  }
}

main().catch(err => {
  console.error(`\n💀 Fatal: ${err.message}`);
  process.exit(1);
});
