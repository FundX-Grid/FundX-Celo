// rescue.js
// Targeted script to recover stuck funds from the FundXEscrow contract.

const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { celo } = require('viem/chains');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const ESCROW_ADDRESS = '0x4e10d988765EA22aAD4E52353f183EbD54D3ea8C';
const CELO_RPC = 'https://forno.celo.org';

const ESCROW_ABI = [
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

function loadWallets() {
  const envContent = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
  const simKeys = [];
  const pattern = /^EVM_WALLET_(\d+)_(\d+)_PRIVATE_KEY$/;
  
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (pattern.test(key)) simKeys.push(value);
  }
  return simKeys.slice(3); // Match Niklaus logic
}

async function main() {
  const keys = loadWallets();
  const pc = createPublicClient({ chain: celo, transport: http(CELO_RPC) });
  
  const count = await pc.readContract({
    address: ESCROW_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'campaignCount',
  });

  console.log(`\n🏥 FUNDX RESCUE MISSION`);
  console.log(`   Latest Campaign: ${count}`);
  console.log(`════════════════════════════════════════\n`);

  // Target the last few campaigns and all wallets
  // The user specifically needs Wallet #1 for #1498
  for (let i = 0; i < keys.length; i++) {
    const account = privateKeyToAccount(keys[i].startsWith('0x') ? keys[i] : `0x${keys[i]}`);
    const wc = createWalletClient({ account, chain: celo, transport: http(CELO_RPC) });

    // Scan last 10 campaigns for this wallet
    const start = Number(count) > 10 ? Number(count) - 10 : 1;
    for (let id = Number(count); id >= start; id--) {
      try {
        console.log(`[Attempt] Wallet #${i} (${account.address.slice(0,8)}) -> Campaign ${id}...`);
        const hash = await wc.writeContract({
          address: ESCROW_ADDRESS,
          abi: ESCROW_ABI,
          functionName: 'claimRefund',
          args: [BigInt(id)],
        });
        console.log(`   ✅ Success! Tx: ${hash}`);
      } catch (e) {
        // Most will fail (already claimed or not your contribution) - skip silently
      }
    }
  }
  console.log(`\n✅ Rescue mission complete.`);
}

main().catch(console.error);
