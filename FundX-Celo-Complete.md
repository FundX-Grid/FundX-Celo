# FundX

## Stable Capital Formation on Celo

FundX is a programmable escrow protocol that enables builders to raise capital in cUSD or USDC on Celo — with transparent, on-chain enforcement of funding rules.

Mobile-first. Stablecoin-native. Built for the world.

---

## Vision

FundX is not just a crowdfunding app.

It is a stable, programmable escrow layer for the next generation of global builders.

Creators raise in the stable asset they choose.
Backers fund with confidence.
Smart contracts enforce the rules.

No custodians. No hidden conditions. No volatility chaos.

---

## The Problem

### 1. Volatility Risk

Traditional Web3 crowdfunding forces builders to raise in volatile tokens like ETH, BTC, or native chain assets. A campaign that hits its goal today could lose 40% of its runway tomorrow before a single line of code is written. Builders deserve a stable runway from day one.

### 2. Escrow Trust

Most crowdfunding platforms, crypto or otherwise, rely on centralized custody. The platform holds the money. The platform decides when to release it. There are no on-chain guarantees. Backers have no verifiable protection. Creators have no verifiable rights. It is all trust in an institution.

### 3. Mobile Users Are Locked Out

Billions of people use smartphones. Across West Africa, East Africa, and beyond, people already hold stablecoins in mobile wallets like MiniPay. Yet virtually every Web3 crowdfunding tool requires a desktop browser, MetaMask, and technical setup that eliminates the majority of the world's population before they even begin. This is a solvable problem.

---

## The Solution

FundX introduces a stablecoin-powered on-chain escrow model built on Celo:

- Funds are held in a Solidity smart contract — not a company, not a multisig, not a person
- Release conditions are enforced programmatically and are visible to anyone
- Creators choose their funding asset at campaign creation — cUSD or USDC
- Platform fees are transparent, fixed, and automatically calculated
- Backer refund protection is embedded in the contract for All-or-Nothing campaigns
- Works natively inside MiniPay with zero additional setup for the backer

---

## Why Celo

Before going deeper, you need to understand why FundX lives on Celo specifically.

**Mobile-first by design.** Celo was built from day one to be accessible on mobile phones, including basic smartphones. Its phone-number-based address system and low gas fees mean real people with real phones can transact.

**MiniPay.** Opera Mini's built-in crypto wallet. Over 3 million users across Nigeria, Ghana, Kenya, and beyond. These users already have cUSD sitting in their wallet. FundX meets them there.

**Stablecoin ecosystem.** Celo has native support for cUSD (Celo Dollar) and USDC (Circle's dollar-backed token). Builders raising money can do so in dollars, not in speculative assets.

**EVM compatibility.** Celo is fully EVM-compatible. Every Solidity pattern, every Foundry tool, every OpenZeppelin library works exactly as it does on Ethereum. There is no new language to learn.

**Fast and cheap.** Celo transactions are fast and cost fractions of a cent. Donating $5 to a campaign should not cost $3 in gas.

---

## Core Concepts Every Developer Must Understand

Before touching a single file, internalize these three things.

### The Contract is the Source of Truth

The frontend is a window. The backend is an index. The contract is reality.

Whatever the contract says — how much is raised, whether a campaign is active, whether a withdrawal has happened — that is the truth. The frontend must reflect this. It must never simulate different logic, display different numbers, or make assumptions. If the contract says a campaign failed, the UI shows failure. Full stop.

### Tokens are Locked Per Campaign

When a creator launches a campaign and chooses cUSD, that campaign is a cUSD campaign forever. Backers donate cUSD. The contract holds cUSD. Withdrawals pay out in cUSD. Refunds return cUSD.

You cannot mix tokens inside a single campaign. The contract enforces this. The UI must also enforce this — never offer a backer the ability to donate USDC to a cUSD campaign.

### State Changes Before Transfers

In every function that moves tokens — withdraw, claim-refund — the contract updates its state (marks withdrawn, deletes the donation record) BEFORE initiating the token transfer. This is the standard reentrancy protection pattern. It means that even if something goes wrong mid-transfer, the contract's state is already consistent. Do not break this pattern.

---

## Token Glossary

| Term | Meaning |
|---|---|
| cUSD | Celo Dollar. A stablecoin native to the Celo blockchain, soft-pegged to $1 USD. ERC-20 compatible. Held natively by MiniPay users. Contract address on mainnet: `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| USDC | USD Coin. Circle's widely-recognized stablecoin. Available on Celo mainnet. Contract address: `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| Atomic units | Both cUSD and USDC have 18 and 6 decimal places respectively. All goal and amount values in the contract are stored in atomic units. 1 cUSD = 1000000000000000000 (18 zeros). 1 USDC = 1000000 (6 zeros). The frontend must handle this conversion before displaying values. |
| Whitelisted token | A token address the contract explicitly permits. Only cUSD and USDC are whitelisted. No other ERC-20 can be used. |

---

## Funding Models Explained

FundX supports two funding models. Every campaign must choose one at creation. This choice cannot be changed.

### Flexible Funding (Model 0)

The creator receives whatever is raised, regardless of whether the goal was met.

When to use it:
- Community projects where partial funding is still useful
- Campaigns where the scope can scale with funding
- Early-stage ideas where any capital accelerates progress

What happens at the end:
- Deadline passes
- Creator calls withdraw
- Contract sends 98% to creator, 2% to protocol
- No refunds issued to backers regardless of outcome

### All-or-Nothing (Model 1)

The creator only receives funds if the full goal is met by the deadline.

When to use it:
- Defined-scope products that need a specific budget to be viable
- Campaigns where partial funding is useless (hardware, audits, etc.)
- Projects where backer protection is a trust signal

What happens at the end (success):
- Deadline passes, goal was reached or exceeded
- Creator calls withdraw
- Contract sends 98% to creator, 2% to protocol

What happens at the end (failure):
- Deadline passes, goal was not reached
- Creator cannot withdraw (contract blocks it)
- Every backer can call claim-refund
- Contract returns 100% of their donation with no fee

---

## Platform Fee

FundX takes a 2% fee on successful withdrawals.

This fee:
- Is calculated automatically by the contract
- Is deducted from the total raised, not added on top
- Is transferred to the contract owner's address at withdrawal time
- Does NOT apply to refunds — backers get 100% back

Example: A campaign raises 10,000 cUSD.
- Fee: 200 cUSD → protocol
- Creator receives: 9,800 cUSD

---

## Campaign Lifecycle

Understanding the full lifecycle of a campaign is essential before building any feature.

```
[CREATION] → Creator defines goal, token, duration, model
     ↓
[ACTIVE]   → Backers donate. Contract holds funds in escrow.
     ↓
[DEADLINE] → Block timestamp passes the campaign deadline
     ↓
  [FLEXIBLE]                    [ALL-OR-NOTHING]
     ↓                               ↓
[WITHDRAW]               [GOAL MET?]
Creator withdraws              ↓           ↓
98% → creator           [YES]           [NO]
2%  → protocol        [WITHDRAW]    [REFUNDS]
                       Creator      Each backer
                       withdraws    claims refund
                       98%/2%       100% returned
```

---

# PART I — SMART CONTRACT ENGINEERING

---

## Design Principles

Every decision in the contract follows these rules:

- **Deterministic** — the same inputs always produce the same outputs
- **Minimal state** — store only what is necessary
- **No loops** — no unbounded iteration ever
- **No dynamic logic** — no runtime code generation
- **Explicit errors** — every failure state has a named error code
- **Transfers last** — state is always updated before any token movement
- **Whitelist only** — no arbitrary token addresses accepted

---

## Data Model

### Campaign Struct

```solidity
struct Campaign {
    address creator;       // Wallet that created the campaign
    address token;         // cUSD or USDC — locked at creation, never changes
    uint256 goal;          // Target amount in token's atomic units
    uint256 deadline;      // Unix timestamp — campaign ends at this point
    uint256 totalRaised;   // Running total of all donations received
    bool withdrawn;        // True once creator has withdrawn — prevents double withdrawal
    bool active;           // False if admin deactivated or after withdrawal
    uint8 fundingModel;    // 0 = Flexible, 1 = All-or-Nothing
}
```

### Storage Layout

```solidity
// All campaigns indexed by ID
mapping(uint256 => Campaign) public campaigns;

// Per-donor contributions per campaign
// donations[campaignId][donorAddress] = amount
mapping(uint256 => mapping(address => uint256)) public donations;

// Running counter for campaign IDs — starts at 0, increments on each creation
uint256 public campaignCount;

// Whitelisted token addresses
mapping(address => bool) public allowedTokens;
```

### Why mapping instead of array?

Arrays in Solidity require iteration to find elements and grow in size in ways that make gas costs unpredictable. Mappings provide O(1) lookups regardless of how many campaigns exist. FundX will never loop over all campaigns. The frontend and an indexer handle listing.

---

## Error Codes

Every revert in the contract uses a named custom error. This is cheaper than string reverts and makes frontend error handling precise.

```solidity
error NotFound();           // Campaign ID does not exist
error NotCreator();         // Caller is not the campaign creator
error Inactive();           // Campaign has been deactivated
error Expired();            // Deadline has passed (used in donate)
error StillActive();        // Deadline has NOT passed yet (used in withdraw/refund)
error GoalNotReached();     // All-or-Nothing goal was not met
error AlreadyWithdrawn();   // Creator already withdrew
error InvalidAmount();      // Zero or negative amount provided
error RefundNotAllowed();   // Refund conditions not met
error NotDonor();           // Caller has no donation on record
error TransferFailed();     // ERC-20 transfer returned false
error NotOwner();           // Caller is not contract owner (admin functions)
error TokenNotAllowed();    // Token address is not whitelisted
error InvalidModel();       // Funding model is not 0 or 1
```

---

## Full Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ================================================================
// FUNDX ESCROW CONTRACT
// Network  : Celo Mainnet
// Tokens   : cUSD, USDC
// Version  : 1.0.0
// ================================================================

contract FundXEscrow {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------

    address public immutable owner;

    uint8 public constant FLEXIBLE       = 0;
    uint8 public constant ALL_OR_NOTHING = 1;

    uint256 public constant PLATFORM_FEE_BPS = 200;  // 2% in basis points
    uint256 public constant BPS_DENOMINATOR  = 10000;

    // Celo Mainnet token addresses
    address public constant CUSD_ADDRESS = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address public constant USDC_ADDRESS = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C;

    // -------------------------------------------------------
    // ERRORS
    // -------------------------------------------------------

    error NotFound();
    error NotCreator();
    error Inactive();
    error Expired();
    error StillActive();
    error GoalNotReached();
    error AlreadyWithdrawn();
    error InvalidAmount();
    error RefundNotAllowed();
    error NotDonor();
    error TransferFailed();
    error NotOwner();
    error TokenNotAllowed();
    error InvalidModel();

    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        address token,
        uint256 goal,
        uint256 deadline,
        uint8 fundingModel
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 net,
        uint256 fee
    );

    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignDeactivated(uint256 indexed campaignId);

    // -------------------------------------------------------
    // DATA MODEL
    // -------------------------------------------------------

    struct Campaign {
        address creator;
        address token;
        uint256 goal;
        uint256 deadline;
        uint256 totalRaised;
        bool withdrawn;
        bool active;
        uint8 fundingModel;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(address => bool) public allowedTokens;

    uint256 public campaignCount;

    // -------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------

    constructor() {
        owner = msg.sender;
        allowedTokens[CUSD_ADDRESS] = true;
        allowedTokens[USDC_ADDRESS] = true;
    }

    // -------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier campaignExists(uint256 id) {
        if (id == 0 || id > campaignCount) revert NotFound();
        _;
    }

    // -------------------------------------------------------
    // READ FUNCTIONS
    // -------------------------------------------------------

    /// @notice Returns full campaign data for a given ID
    function getCampaign(uint256 id) external view returns (Campaign memory) {
        if (id == 0 || id > campaignCount) revert NotFound();
        return campaigns[id];
    }

    /// @notice Returns how much a specific donor contributed to a campaign
    function getDonation(uint256 campaignId, address donor)
        external
        view
        returns (uint256)
    {
        return donations[campaignId][donor];
    }

    /// @notice Calculates the 2% platform fee on a given amount
    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
    }

    /// @notice Calculates the net amount a creator receives after fee
    function calculateNet(uint256 amount) public pure returns (uint256) {
        return amount - calculateFee(amount);
    }

    /// @notice Returns true if the campaign deadline has passed
    function isPastDeadline(uint256 id) external view campaignExists(id) returns (bool) {
        return block.timestamp >= campaigns[id].deadline;
    }

    /// @notice Returns true if the campaign has met or exceeded its goal
    function isGoalReached(uint256 id) external view campaignExists(id) returns (bool) {
        Campaign memory c = campaigns[id];
        return c.totalRaised >= c.goal;
    }

    // -------------------------------------------------------
    // CREATE CAMPAIGN
    // -------------------------------------------------------

    /// @notice Creates a new fundraising campaign
    /// @param token      Address of the funding token — must be cUSD or USDC
    /// @param goal       Funding target in the token's atomic units
    /// @param duration   Campaign length in seconds (e.g., 30 days = 2592000)
    /// @param fundingModel  0 for Flexible, 1 for All-or-Nothing
    /// @return id        The newly assigned campaign ID

    function createCampaign(
        address token,
        uint256 goal,
        uint256 duration,
        uint8 fundingModel
    ) external returns (uint256 id) {
        if (!allowedTokens[token])                            revert TokenNotAllowed();
        if (goal == 0)                                        revert InvalidAmount();
        if (duration == 0)                                    revert InvalidAmount();
        if (fundingModel != FLEXIBLE && fundingModel != ALL_OR_NOTHING)
                                                              revert InvalidModel();

        campaignCount++;
        id = campaignCount;

        campaigns[id] = Campaign({
            creator:      msg.sender,
            token:        token,
            goal:         goal,
            deadline:     block.timestamp + duration,
            totalRaised:  0,
            withdrawn:    false,
            active:       true,
            fundingModel: fundingModel
        });

        emit CampaignCreated(id, msg.sender, token, goal, block.timestamp + duration, fundingModel);
    }

    // -------------------------------------------------------
    // DONATE
    // -------------------------------------------------------

    /// @notice Donates tokens to a campaign vault
    /// @dev    Caller must approve this contract to spend `amount` of the campaign token first
    /// @param  id      Campaign ID
    /// @param  amount  Token amount in atomic units

    function donate(uint256 id, uint256 amount) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (!c.active)                           revert Inactive();
        if (block.timestamp >= c.deadline)       revert Expired();
        if (amount == 0)                         revert InvalidAmount();

        // Pull tokens from donor into this contract (escrow)
        IERC20(c.token).safeTransferFrom(msg.sender, address(this), amount);

        // Accumulate donor's contribution
        donations[id][msg.sender] += amount;

        // Update campaign running total
        c.totalRaised += amount;

        emit DonationReceived(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // WITHDRAW
    // -------------------------------------------------------

    /// @notice Creator withdraws funds after a successful campaign
    /// @dev    Flexible: callable after deadline regardless of goal
    ///         All-or-Nothing: callable after deadline only if goal was reached
    /// @param  id  Campaign ID

    function withdraw(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (msg.sender != c.creator)             revert NotCreator();
        if (c.withdrawn)                         revert AlreadyWithdrawn();
        if (block.timestamp < c.deadline)        revert StillActive();

        // All-or-Nothing: block withdrawal if goal not met
        if (
            c.fundingModel == ALL_OR_NOTHING &&
            c.totalRaised < c.goal
        ) revert GoalNotReached();

        uint256 raised = c.totalRaised;
        uint256 fee    = calculateFee(raised);
        uint256 net    = raised - fee;

        // REENTRANCY GUARD: update state before any transfer
        c.withdrawn = true;
        c.active    = false;

        // Transfer 2% fee to protocol owner
        IERC20(c.token).safeTransfer(owner, fee);

        // Transfer 98% net to creator
        IERC20(c.token).safeTransfer(c.creator, net);

        emit FundsWithdrawn(id, c.creator, net, fee);
    }

    // -------------------------------------------------------
    // CLAIM REFUND
    // -------------------------------------------------------

    /// @notice Backers reclaim their donation on a failed All-or-Nothing campaign
    /// @dev    Eligible only when ALL THREE conditions hold:
    ///           1. Campaign is All-or-Nothing
    ///           2. Deadline has passed
    ///           3. Goal was NOT reached
    /// @param  id  Campaign ID

    function claimRefund(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        uint256 amount = donations[id][msg.sender];

        if (c.fundingModel != ALL_OR_NOTHING)    revert RefundNotAllowed();
        if (block.timestamp < c.deadline)        revert StillActive();
        if (c.totalRaised >= c.goal)             revert RefundNotAllowed();
        if (amount == 0)                         revert NotDonor();

        // DOUBLE-CLAIM GUARD: delete record before transfer
        donations[id][msg.sender] = 0;

        // Return full donation — no fee on refunds
        IERC20(c.token).safeTransfer(msg.sender, amount);

        emit RefundClaimed(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // ADMIN — EMERGENCY DEACTIVATE
    // -------------------------------------------------------

    /// @notice Blocks new donations to a campaign (owner only)
    /// @dev    Does NOT move or freeze escrowed funds.
    ///         Existing withdrawal and refund rights are fully preserved.
    /// @param  id  Campaign ID

    function deactivateCampaign(uint256 id) external onlyOwner campaignExists(id) {
        campaigns[id].active = false;
        emit CampaignDeactivated(id);
    }

    // -------------------------------------------------------
    // ADMIN — MANAGE ALLOWED TOKENS
    // -------------------------------------------------------

    /// @notice Add or remove a token from the whitelist
    /// @dev    Use with extreme caution. Removing a token while campaigns
    ///         are active using that token will not affect those campaigns
    ///         but will prevent new campaigns from selecting it.
    function setAllowedToken(address token, bool allowed) external onlyOwner {
        allowedTokens[token] = allowed;
    }
}
```

---

## Contract Deployment Checklist

Before deploying to Celo mainnet:

1. Run the full Foundry test suite — `forge test -vvv`
2. Verify cUSD and USDC contract addresses are correct for mainnet vs testnet
3. Deploy with a cold wallet — the deployer address becomes the permanent owner and fee recipient
4. Verify the contract on Celoscan — `forge verify-contract`
5. Test createCampaign, donate, withdraw, and claimRefund on Alfajores testnet first
6. Confirm token whitelist is correct post-deployment via `allowedTokens(address)`

---

## Foundry Setup

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Initialize project
forge init fundx-contracts
cd fundx-contracts

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Compile
forge build

# Test
forge test -vvv

# Deploy to Alfajores testnet
forge script script/Deploy.s.sol \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast \
  --verify

# Deploy to Celo mainnet
forge script script/Deploy.s.sol \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify
```

### Deployment Script

```solidity
// script/Deploy.s.sol
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FundXEscrow.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        FundXEscrow escrow = new FundXEscrow();
        console.log("FundXEscrow deployed at:", address(escrow));
        vm.stopBroadcast();
    }
}
```

---

# PART II — FRONTEND ENGINEERING

---

## Core Philosophy

The frontend is:
- A deterministic UI for a deterministic contract
- A visibility layer, not a logic layer
- Not the source of truth — the contract is

The UI must never:
- Simulate financial logic the contract does not have
- Display numbers that don't match contract state
- Allow actions that the contract will reject

If the contract will revert, the UI should prevent the action before the user even submits the transaction.

---

## Folder Structure

```
/app
  /campaigns          → Explore all campaigns
  /create             → Campaign creation wizard
  /campaign/[id]      → Single campaign page
  /dashboard          → Creator view

/components
  /campaign
    CampaignCard.tsx       → Grid card with token badge + funding model badge
    CampaignHero.tsx       → Full-width featured campaign
    FundingModelBadge.tsx  → Flexible / All-or-Nothing label
    TokenBadge.tsx         → cUSD / USDC label
    GoalProgress.tsx       → Progress bar
    StatusBadge.tsx        → Active / Successful / Failed
  /donation
    DonateModal.tsx        → Donation flow (adapts to wallet type)
    AmountInput.tsx        → Token-aware amount entry
  /withdraw
    WithdrawPanel.tsx      → Eligibility check + withdraw action
  /refund
    RefundPanel.tsx        → Refund availability + claim action
  /wallet
    WalletConnect.tsx      → MiniPay / MetaMask / Valora detection
    WalletBadge.tsx        → Connected wallet display
  /layout
    Navbar.tsx
    Footer.tsx

/hooks
  useCampaign.ts      → Fetch and parse single campaign
  useCampaigns.ts     → Fetch and list all campaigns
  useDonate.ts        → Execute donation transaction
  useWithdraw.ts      → Execute withdrawal transaction
  useRefund.ts        → Execute refund claim transaction
  useWallet.ts        → Wallet detection and connection

/lib
  contract.ts         → All contract interaction functions
  tokens.ts           → Token addresses, decimals, formatters
  time.ts             → Duration helpers (seconds → human readable)
  fee.ts              → Fee calculation (mirrors contract logic)
  errors.ts           → Error code → user-facing message mapping
  constants.ts        → Chain IDs, RPC URLs, contract address

/types
  campaign.ts
  donation.ts
  token.ts
```

---

## TypeScript Types

```typescript
// types/token.ts
export type TokenSymbol = "cUSD" | "USDC"

export interface Token {
  symbol: TokenSymbol
  address: string
  decimals: number
  color: string
}

// types/campaign.ts
export type FundingModel = 0 | 1  // 0 = Flexible, 1 = All-or-Nothing
export type CampaignStatus = "active" | "successful" | "failed"

export interface Campaign {
  id: number
  creator: string
  token: Token
  goal: bigint
  deadline: number           // Unix timestamp
  totalRaised: bigint
  withdrawn: boolean
  active: boolean
  fundingModel: FundingModel
  // Derived fields (computed by frontend, not stored on-chain)
  status: CampaignStatus
  percentRaised: number
  // Off-chain metadata (stored in backend / IPFS)
  title: string
  tagline: string
  description: string
  image: string
  category: string
  projectStage: string
  location: string
  budgetBreakdown: string
  roadmap: string
  videoUrl: string
  creator_name: string
  creator_bio: string
  twitter: string
  github: string
  portfolio: string
}
```

---

## Token Configuration

```typescript
// lib/tokens.ts
import { formatUnits, parseUnits } from "viem"

export const TOKENS = {
  cUSD: {
    symbol: "cUSD" as const,
    address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    decimals: 18,
    color: "emerald",
  },
  USDC: {
    symbol: "USDC" as const,
    address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    decimals: 6,
    color: "blue",
  },
} as const

export function formatTokenAmount(amount: bigint, symbol: "cUSD" | "USDC"): string {
  const decimals = TOKENS[symbol].decimals
  return Number(formatUnits(amount, decimals)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseTokenAmount(amount: string, symbol: "cUSD" | "USDC"): bigint {
  return parseUnits(amount, TOKENS[symbol].decimals)
}

export function getTokenByAddress(address: string) {
  return Object.values(TOKENS).find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  )
}
```

---

## MiniPay Detection

This is the single most important integration for the Proof of Ship requirement.

```typescript
// lib/wallet.ts
export function detectWallet() {
  if (typeof window === "undefined") return "none"
  if (window.ethereum?.isMiniPay)  return "minipay"
  if (window.ethereum?.isMetaMask) return "metamask"
  return "unknown"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
```

```typescript
// hooks/useWallet.ts
import { detectWallet, isMiniPay } from "@/lib/wallet"
import { TOKENS } from "@/lib/tokens"

export function useWallet() {
  const walletType = detectWallet()

  // MiniPay users default to cUSD — they almost certainly hold it already
  const defaultToken = isMiniPay() ? TOKENS.cUSD : TOKENS.cUSD

  return {
    walletType,
    isMiniPay: walletType === "minipay",
    defaultToken,
  }
}
```

### How the UI adapts per wallet

| Feature | MiniPay | MetaMask / Valora |
|---|---|---|
| Default token | cUSD (locked) | cUSD (selectable) |
| Token selector shown | No | Yes |
| Layout | Mobile-optimized | Full desktop/mobile |
| Wallet connect button | Hidden (auto-connects) | Shown |

---

## Contract Abstraction Layer

Never call the contract directly from components. All contract interactions live in `/lib/contract.ts`. Components call hooks. Hooks call this library.

```typescript
// lib/contract.ts
import { createPublicClient, createWalletClient, http, custom } from "viem"
import { celo } from "viem/chains"
import { FUNDX_ABI } from "./abi"
import { FUNDX_CONTRACT_ADDRESS } from "./constants"

const publicClient = createPublicClient({
  chain: celo,
  transport: http()
})

// READ: Get single campaign from contract
export async function getCampaign(id: number) {
  return publicClient.readContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "getCampaign",
    args: [BigInt(id)],
  })
}

// READ: Get donor's contribution to a campaign
export async function getDonation(campaignId: number, donor: string) {
  return publicClient.readContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "getDonation",
    args: [BigInt(campaignId), donor as `0x${string}`],
  })
}

// WRITE: Create a new campaign
export async function createCampaign(
  token: string,
  goal: bigint,
  duration: number,    // in seconds
  fundingModel: 0 | 1
) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum!)
  })
  const [account] = await walletClient.getAddresses()
  return walletClient.writeContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "createCampaign",
    args: [token as `0x${string}`, goal, BigInt(duration), fundingModel],
    account,
  })
}

// WRITE: Approve token spend then donate
// NOTE: Donor must approve the contract to spend their tokens first.
// This requires two transactions: approve, then donate.
export async function approveAndDonate(
  tokenAddress: string,
  campaignId: number,
  amount: bigint
) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum!)
  })
  const [account] = await walletClient.getAddresses()

  // Step 1: Approve
  await walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [FUNDX_CONTRACT_ADDRESS, amount],
    account,
  })

  // Step 2: Donate
  return walletClient.writeContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "donate",
    args: [BigInt(campaignId), amount],
    account,
  })
}

// WRITE: Withdraw funds (creator only)
export async function withdraw(campaignId: number) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum!)
  })
  const [account] = await walletClient.getAddresses()
  return walletClient.writeContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "withdraw",
    args: [BigInt(campaignId)],
    account,
  })
}

// WRITE: Claim refund (backer only, All-or-Nothing failed campaigns)
export async function claimRefund(campaignId: number) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum!)
  })
  const [account] = await walletClient.getAddresses()
  return walletClient.writeContract({
    address: FUNDX_CONTRACT_ADDRESS,
    abi: FUNDX_ABI,
    functionName: "claimRefund",
    args: [BigInt(campaignId)],
    account,
  })
}
```

---

## Time Utility

On EVM chains, deadlines are Unix timestamps (seconds since Jan 1 1970). Never display raw timestamps to users.

```typescript
// lib/time.ts

// Convert a deadline timestamp to days remaining
export function daysRemaining(deadline: number): number {
  const now = Math.floor(Date.now() / 1000)
  const diff = deadline - now
  if (diff <= 0) return 0
  return Math.ceil(diff / 86400)
}

// Convert a deadline to human-readable string
export function formatDeadline(deadline: number): string {
  const days = daysRemaining(deadline)
  if (days === 0) return "Ended"
  if (days === 1) return "1 day left"
  return `${days} days left`
}

// Convert days (from create form) to seconds (for contract)
export function daysToSeconds(days: number): number {
  return days * 86400
}

export function isPastDeadline(deadline: number): boolean {
  return Math.floor(Date.now() / 1000) >= deadline
}
```

---

## Fee Utility

Mirror the contract's fee logic exactly. This lets you show accurate numbers before a transaction is submitted.

```typescript
// lib/fee.ts

const PLATFORM_FEE_BPS = 200n
const BPS_DENOMINATOR = 10000n

export function calculateFee(amount: bigint): bigint {
  return (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR
}

export function calculateNet(amount: bigint): bigint {
  return amount - calculateFee(amount)
}
```

---

## Error Mapping

Map contract errors to messages users can actually read.

```typescript
// lib/errors.ts

export const CONTRACT_ERRORS: Record<string, string> = {
  NotFound:          "Campaign not found.",
  NotCreator:        "Only the campaign creator can do this.",
  Inactive:          "This campaign is no longer accepting donations.",
  Expired:           "This campaign has ended.",
  StillActive:       "This campaign has not ended yet.",
  GoalNotReached:    "The funding goal was not reached.",
  AlreadyWithdrawn:  "Funds have already been withdrawn.",
  InvalidAmount:     "Please enter a valid amount.",
  RefundNotAllowed:  "Refunds are not available for this campaign.",
  NotDonor:          "No donation found for your address.",
  TransferFailed:    "Token transfer failed. Check your balance and approval.",
  NotOwner:          "Only the contract owner can do this.",
  TokenNotAllowed:   "This token is not supported.",
  InvalidModel:      "Invalid funding model selected.",
}

export function parseContractError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  for (const [key, readable] of Object.entries(CONTRACT_ERRORS)) {
    if (message.includes(key)) return readable
  }
  return "Something went wrong. Please try again."
}
```

---

## Campaign Creation Wizard

The create flow uses a 6-step wizard. Each step maps to a group of fields. All steps share one `formData` state object managed by the parent page.

```typescript
// app/create/page.tsx — shared form state shape
export interface CreateCampaignData {
  // Step 1 — Identity
  creatorName: string
  email: string
  twitter: string
  github: string
  portfolio: string

  // Step 2 — Bio
  creatorBio: string

  // Step 3 — Project Basics
  title: string
  tagline: string
  image: string
  category: string
  projectStage: string

  // Step 4 — The Pitch
  videoUrl: string
  description: string

  // Step 5 — Execution
  budgetBreakdown: string
  roadmap: string

  // Step 6 — Funding Goals (on-chain fields)
  token: "cUSD" | "USDC"   // Replaces old currency field
  goal: string
  duration: string           // in days — converted to seconds before contract call
  fundingModel: "0" | "1"
}
```

### Step 6 Token Logic

Step 6 is where the on-chain parameters are set. MiniPay users see cUSD pre-selected and the token selector is hidden. All other wallets see the full selector.

```tsx
// In WizardSteps.tsx Step 6
const { isMiniPay } = useWallet()

{!isMiniPay && (
  <Select onValueChange={(val) => setFormData({...formData, token: val as "cUSD" | "USDC"})}>
    <SelectItem value="cUSD">cUSD — Celo Dollar (MiniPay native)</SelectItem>
    <SelectItem value="USDC">USDC — USD Coin</SelectItem>
  </Select>
)}

{isMiniPay && (
  <div className="p-4 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
    Your campaign will raise in cUSD — the native currency of MiniPay.
  </div>
)}
```

---

## Data File — Updated for Celo

The `data.ts` mock file drives the explore page and campaign cards before live contract indexing is built. Update it to reflect the Celo token structure.

```typescript
// data.ts key changes
export type TokenSymbol = "cUSD" | "USDC"   // replaces "USDCx" | "STX"

export interface Campaign {
  // ... all existing fields ...
  currency: TokenSymbol                       // updated type
  token_address: string                       // new — actual contract token address
}

// Update all mock entries:
// currency: "USDCx" → "cUSD"
// currency: "STX"   → "USDC"
// Add token_address to each entry
```

---

## UX Rules — When to Enable/Disable Actions

These rules must be enforced in the UI before a user attempts a transaction.

### Donate button

| Condition | State |
|---|---|
| Deadline has passed | Disabled — "Campaign Ended" |
| Campaign inactive | Disabled — "Campaign Closed" |
| Goal already reached (All-or-Nothing) | Disabled — "Goal Reached" |
| Wallet not connected | Disabled — "Connect Wallet" |
| Amount is zero | Disabled — "Enter Amount" |
| All conditions OK | Enabled |

### Withdraw button (creator view)

| Condition | State |
|---|---|
| Deadline has not passed | Disabled — "Campaign Still Active" |
| Already withdrawn | Disabled — "Already Withdrawn" |
| All-or-Nothing and goal not reached | Disabled — "Goal Not Reached" |
| All conditions OK | Enabled |

### Claim Refund button (backer view)

| Condition | State |
|---|---|
| Campaign is Flexible | Hidden — not applicable |
| Deadline has not passed | Disabled — "Campaign Still Active" |
| Goal was reached | Disabled — "Goal Was Reached" |
| Donor has no recorded donation | Disabled — "No Donation Found" |
| All conditions OK | Enabled |

---

## Humanity Verification

FundX integrates identity verification for campaign creators. This adds a trust signal for backers and satisfies the Proof of Ship requirement.

**Recommended: Self Protocol**

Self Protocol is Celo-native, uses ZK proofs to verify passport data, and is privacy-preserving. The user scans their passport — no personal data is ever stored.

Integration flow:
1. Creator completes Self Protocol verification off-platform
2. Self Protocol issues an on-chain attestation to the creator's address
3. FundX frontend reads the attestation and displays a verification badge on campaigns from that creator

**Alternatives:**
- Worldcoin — World ID proof of personhood
- Coinbase Verification — on-chain attestation from Coinbase's identity system

---

# PART III — SECURITY MODEL

---

## Threat Categories and Mitigations

### Reentrancy

**Threat:** A malicious token contract or recipient triggers the FundX contract again mid-execution, allowing double withdrawals or double refunds.

**Mitigation:** State is updated before any transfer in both `withdraw` and `claimRefund`. By the time tokens move, the contract already considers the action complete.

### Double Withdrawal

**Threat:** Creator calls withdraw twice, draining the contract.

**Mitigation:** `withdrawn` flag is set to `true` before transfers. Second call reverts with `AlreadyWithdrawn`.

### Double Refund

**Threat:** Backer calls claimRefund twice, receiving double their donation.

**Mitigation:** `donations[id][msg.sender]` is set to `0` before the refund transfer. Second call reverts with `NotDonor`.

### Unauthorized Withdrawal

**Threat:** Anyone calls withdraw on a campaign they did not create.

**Mitigation:** `msg.sender != c.creator` check at the top of withdraw. Reverts with `NotCreator`.

### Early Withdrawal

**Threat:** Creator withdraws before the deadline, bypassing backer protection.

**Mitigation:** `block.timestamp < c.deadline` check. Reverts with `StillActive`.

### Token Injection

**Threat:** Attacker creates a campaign with a malicious ERC-20 address designed to manipulate behavior.

**Mitigation:** `allowedTokens` whitelist. Any token address not explicitly approved reverts with `TokenNotAllowed`.

### Integer Overflow

**Mitigation:** Solidity 0.8.x has overflow/underflow checks built in. SafeERC20 is used for all token transfers to handle non-standard return values.

### Economic Griefing

**Threat:** Attacker donates dust amounts to all-or-nothing campaigns to prevent clean accounting.

**Assessment:** Low impact. Total raised still won't reach goal if attacker can't fund it fully. Refunds work per donor and are not affected by other donors.

---

# PART IV — BACKEND (OPTIONAL)

---

The backend does not touch funds. It does not contain financial logic. It is purely an indexing and metadata layer.

**What the backend handles:**
- Campaign metadata storage (title, description, images, roadmap)
- IPFS uploads for rich content
- Indexing contract events for fast frontend queries
- Campaign search and filtering
- Analytics (total campaigns, total raised, trending)

**What the backend never does:**
- Handle tokens or funds
- Make decisions about withdrawals
- Override contract state
- Serve as a source of truth for financial data

Every financial piece of data must come from the contract. The backend can cache it for performance, but must never be trusted over the contract.

---

# PART V — ROADMAP

---

## Phase 1 — Stable Crowdfunding on Celo (Now)

- Smart contract deployment on Celo mainnet
- cUSD and USDC support
- Flexible and All-or-Nothing funding models
- MiniPay native integration
- Humanity verification (Self Protocol)
- Proof of Ship submission

## Phase 2 — Milestone Escrow

- Structured fund releases tied to predefined milestones
- Backer approval voting on milestone completion
- Campaign analytics dashboard
- Campaign updates and comment threads

## Phase 3 — Treasury Infrastructure

- Capital pooling for teams and DAOs
- Multi-signatory campaign management
- Grant disbursement tooling for ecosystem programs

## Phase 4 — Ecosystem Integration

- Celo grant program native integration
- Hackathon sponsorship tooling
- Mobile accelerator partnerships across West and East Africa

---

# QUICK REFERENCE

---

## Contract Addresses

| Token | Network | Address |
|---|---|---|
| cUSD | Celo Mainnet | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| cUSD | Alfajores Testnet | `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` |
| USDC | Celo Mainnet | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| USDC | Alfajores Testnet | (use faucet) |

## Celo RPC URLs

| Network | URL |
|---|---|
| Mainnet | `https://forno.celo.org` |
| Alfajores Testnet | `https://alfajores-forno.celo-testnet.org` |

## Useful Links

| Resource | URL |
|---|---|
| Celo Docs | https://docs.celo.org |
| MiniPay Docs | https://docs.celo.org/developer/build-on-minipay |
| Celoscan | https://celoscan.io |
| Alfajores Faucet | https://faucet.celo.org |
| Self Protocol | https://self.xyz |
| Foundry Book | https://book.getfoundry.sh |

---

## License

MIT
