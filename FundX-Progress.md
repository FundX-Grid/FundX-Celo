# FundX — Implementation Progress Guide

> This document is your single source of truth for building FundX on Celo from zero to deployed.
> Every step is written so that you never have to guess what comes next.
> Work top to bottom. Do not skip steps. Check off each item as you complete it.

---

## How to Use This Document

- Each phase has a goal. Read the goal before starting the phase.
- Each step has an action, the exact command or code, and the expected result.
- If a step says "you should see", verify it before moving on.
- If something does not match the expected result, there is a troubleshooting note.
- At the end of each phase there is a Phase Checkpoint. Pass it before moving to the next phase.

---

## Master Progress Tracker

```
[ ] PHASE 0 — Prerequisites & Environment
[ ] PHASE 1 — Smart Contract: Setup
[ ] PHASE 2 — Smart Contract: Write & Compile
[ ] PHASE 3 — Smart Contract: Test
[ ] PHASE 4 — Smart Contract: Deploy to Testnet
[ ] PHASE 5 — Frontend: Setup
[ ] PHASE 6 — Frontend: Wallet & Token Layer
[ ] PHASE 7 — Frontend: Contract Integration
[ ] PHASE 8 — Frontend: MiniPay Integration
[ ] PHASE 9 — Frontend: Campaign Creation Wizard (Celo)
[ ] PHASE 10 — Frontend: Campaign Explore & Detail Pages
[ ] PHASE 11 — Frontend: Donate Flow
[ ] PHASE 12 — Frontend: Withdraw & Refund Flows
[ ] PHASE 13 — Humanity Verification
[ ] PHASE 14 — Deploy to Celo Mainnet
[ ] PHASE 15 — Proof of Ship Submission
```

---

---

# PHASE 0 — Prerequisites & Environment

**Goal:** Have every tool installed and verified before writing a single line of project code.

---

## 0.1 — Node.js

**What it is:** The JavaScript runtime that powers your frontend and scripts.

**Action:** Check if Node.js is installed.

```bash
node --version
```

**You should see:** A version number starting with `v18` or higher, for example `v20.11.0`.

**If you see "command not found":**

Go to https://nodejs.org and download the LTS version. Install it. Run the check again.

**If you see v16 or lower:**

Go to https://nodejs.org, download the LTS version, reinstall, run the check again.

- [ ] Node.js 18+ confirmed

---

## 0.2 — npm

**What it is:** The package manager that comes with Node.js. You will use it to install frontend libraries.

**Action:**

```bash
npm --version
```

**You should see:** A version number like `10.2.4`. Anything above 8 is fine.

- [ ] npm confirmed

---

## 0.3 — Git

**What it is:** Version control. Lets you track changes and push your code to GitHub.

**Action:**

```bash
git --version
```

**You should see:** Something like `git version 2.42.0`.

**If not installed:** Go to https://git-scm.com and install it.

- [ ] Git confirmed

---

## 0.4 — Foundry

**What it is:** The Solidity development toolkit. You will use it to compile, test, and deploy your smart contract.

**Action:** Install Foundry.

```bash
curl -L https://foundry.paradigm.xyz | bash
```

**After it finishes, run:**

```bash
foundryup
```

**This installs four tools. Verify each one:**

```bash
forge --version
cast --version
anvil --version
chisel --version
```

**You should see** version numbers for all four. Example: `forge 0.2.0 (abc1234 2024-01-01)`.

**If `foundryup` is not found after install:**

Close your terminal, open a new one, and run `foundryup` again.

- [ ] forge confirmed
- [ ] cast confirmed
- [ ] anvil confirmed

---

## 0.5 — A Code Editor

**What it is:** Where you write your code.

**Recommended:** Visual Studio Code — https://code.visualstudio.com

**Recommended extensions:**
- Solidity (by Nomic Foundation)
- Prettier
- ESLint
- Tailwind CSS IntelliSense

- [ ] Code editor ready

---

## 0.6 — A Celo Wallet for Development

**What it is:** You need a wallet to sign transactions during deployment and testing.

**Option A — MetaMask (browser extension)**
1. Install MetaMask from https://metamask.io
2. Create a new wallet or import an existing one
3. Save your seed phrase somewhere safe

**Add Celo Alfajores Testnet to MetaMask:**
- Network Name: `Celo Alfajores Testnet`
- RPC URL: `https://alfajores-forno.celo-testnet.org`
- Chain ID: `44787`
- Currency Symbol: `CELO`
- Block Explorer: `https://alfajores.celoscan.io`

**Option B — Valora (mobile)**
- Download Valora from the App Store or Google Play
- Create a wallet
- Switch to testnet in settings

- [ ] Wallet created and Alfajores network added

---

## 0.7 — Get Testnet Funds

**What it is:** Fake CELO and cUSD for the Alfajores testnet. Free. Used only for testing.

**Action:**
1. Go to https://faucet.celo.org
2. Select `Alfajores`
3. Paste your wallet address
4. Request funds

**You should see** a success message. Wait 30 seconds, then check your wallet balance.

**Also get testnet cUSD:**
- On the same faucet page, look for cUSD option and request it
- Alternatively, use the Ubeswap testnet to swap testnet CELO for cUSD

- [ ] Testnet CELO received
- [ ] Testnet cUSD received

---

## 0.8 — Get Your Deployer Private Key

**What it is:** You need your wallet's private key to sign deployments from your terminal. This is only for development. NEVER share this key. NEVER commit it to Git.

**In MetaMask:**
1. Click the three dots next to your account name
2. Click Account Details
3. Click Export Private Key
4. Enter your MetaMask password
5. Copy the private key

**Save it somewhere secure but accessible — you will need it in Phase 4.**

- [ ] Private key saved securely (NOT in your project folder)

---

## Phase 0 Checkpoint

Before continuing, confirm:

```
[ ] node --version shows v18+
[ ] forge --version shows a version number
[ ] MetaMask installed with Alfajores network added
[ ] Testnet CELO and cUSD in your wallet
[ ] Private key saved securely
```

If all five are checked, move to Phase 1.

---

---

# PHASE 1 — Smart Contract: Setup

**Goal:** Create the Foundry project, install dependencies, and set up your folder structure.

---

## 1.1 — Create a folder for the whole project

**Action:**

```bash
mkdir fundx
cd fundx
```

This is your project root. Everything lives here.

- [ ] fundx folder created and entered

---

## 1.2 — Create the contracts subfolder using Foundry

**Action:**

```bash
forge init contracts
cd contracts
```

**You should see:** Foundry creates a folder called `contracts` with this structure:

```
contracts/
  src/
    Counter.sol       ← placeholder, you will delete this
  test/
    Counter.t.sol     ← placeholder, you will delete this
  script/
    Counter.s.sol     ← placeholder, you will delete this
  foundry.toml        ← Foundry configuration file
  lib/
    forge-std/        ← Foundry's standard library (auto-installed)
```

- [ ] Foundry project initialized

---

## 1.3 — Delete the placeholder files

**Action:**

```bash
rm src/Counter.sol
rm test/Counter.t.sol
rm script/Counter.s.sol
```

- [ ] Placeholder files removed

---

## 1.4 — Install OpenZeppelin Contracts

**What it is:** A library of secure, audited Solidity contracts. FundX uses `IERC20` and `SafeERC20` from this library.

**Action:**

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

**You should see:** Foundry cloning the OpenZeppelin repo into `lib/openzeppelin-contracts`.

**Then add the remapping so Solidity can find the library:**

Open `foundry.toml` in your editor. It looks like this:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
```

Add the remappings line so it becomes:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]
```

Save the file.

- [ ] OpenZeppelin installed
- [ ] Remapping added to foundry.toml

---

## 1.5 — Create the contract file

**Action:**

```bash
touch src/FundXEscrow.sol
```

- [ ] FundXEscrow.sol created

---

## 1.6 — Create the test file

**Action:**

```bash
touch test/FundXEscrow.t.sol
```

- [ ] FundXEscrow.t.sol created

---

## 1.7 — Create the deployment script

**Action:**

```bash
touch script/Deploy.s.sol
```

- [ ] Deploy.s.sol created

---

## 1.8 — Create the environment file

**What it is:** A file that stores your private key and RPC URLs. This file must NEVER be committed to Git.

**Action:**

```bash
touch .env
```

Open `.env` and add:

```
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CELO_RPC=https://forno.celo.org
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

Replace `your_private_key_here` with the private key you saved in Phase 0.8.

For the Celoscan API key: go to https://celoscan.io, create a free account, go to API Keys, and generate one. Paste it in.

**Now protect the file from Git:**

```bash
echo ".env" >> .gitignore
```

**Verify it is ignored:**

```bash
cat .gitignore
```

**You should see** `.env` listed.

- [ ] .env created with private key and RPC URLs
- [ ] .env added to .gitignore

---

## Phase 1 Checkpoint

Your `contracts/` folder should now look like:

```
contracts/
  src/
    FundXEscrow.sol     ← empty
  test/
    FundXEscrow.t.sol   ← empty
  script/
    Deploy.s.sol        ← empty
  lib/
    forge-std/
    openzeppelin-contracts/
  foundry.toml          ← has remappings
  .env                  ← has private key
  .gitignore            ← contains .env
```

If this matches, move to Phase 2.

---

---

# PHASE 2 — Smart Contract: Write & Compile

**Goal:** Write the full FundX escrow contract and confirm it compiles with zero errors.

---

## 2.1 — Write the contract

Open `src/FundXEscrow.sol` and paste the entire contract below.

Read each section's comment before moving past it. The comments explain WHY, not just WHAT.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ================================================================
// FUNDX ESCROW CONTRACT
// Network  : Celo Mainnet / Alfajores Testnet
// Tokens   : cUSD, USDC
// Version  : 1.0.0
//
// What this contract does:
//   - Lets anyone create a fundraising campaign
//   - Holds donated tokens in escrow (no one can touch them except rules)
//   - Releases funds to creator if conditions are met
//   - Returns funds to donors if All-or-Nothing campaign fails
// ================================================================

contract FundXEscrow {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------
    // IMMUTABLES
    // owner is set once at deployment and never changes.
    // This is the address that receives the 2% platform fee.
    // -------------------------------------------------------

    address public immutable owner;

    // -------------------------------------------------------
    // CONSTANTS
    // These values never change after deployment.
    // -------------------------------------------------------

    // Funding model identifiers
    uint8 public constant FLEXIBLE       = 0;
    uint8 public constant ALL_OR_NOTHING = 1;

    // Fee: 200 basis points = 2%
    // Basis points are used to avoid floating point math.
    // 200 / 10000 = 0.02 = 2%
    uint256 public constant PLATFORM_FEE_BPS = 200;
    uint256 public constant BPS_DENOMINATOR  = 10000;

    // Official token addresses on Celo Mainnet
    // When testing on Alfajores, you will use different addresses
    // (set in the deploy script based on the chain)
    address public constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address public constant USDC_MAINNET = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C;

    // -------------------------------------------------------
    // CUSTOM ERRORS
    // Cheaper than string reverts. Each one is specific.
    // The frontend maps these to user-readable messages.
    // -------------------------------------------------------

    error NotFound();           // Campaign ID does not exist
    error NotCreator();         // Caller is not the campaign creator
    error Inactive();           // Campaign has been deactivated
    error Expired();            // Deadline has passed — used when donating
    error StillActive();        // Deadline has NOT passed — used when withdrawing or refunding
    error GoalNotReached();     // All-or-Nothing goal was not met — used when creator tries to withdraw
    error AlreadyWithdrawn();   // Withdraw was already called on this campaign
    error InvalidAmount();      // Amount is zero
    error RefundNotAllowed();   // Refund conditions are not satisfied
    error NotDonor();           // Caller has zero recorded donation on this campaign
    error TransferFailed();     // ERC-20 transfer did not succeed
    error NotOwner();           // Caller is not the contract owner
    error TokenNotAllowed();    // Token address is not on the whitelist
    error InvalidModel();       // Funding model is not 0 or 1

    // -------------------------------------------------------
    // EVENTS
    // Events are emitted after every important action.
    // Your frontend and indexers listen to these to update state.
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
    // DATA STRUCTURES
    // -------------------------------------------------------

    struct Campaign {
        address creator;       // Who created the campaign
        address token;         // cUSD or USDC — set at creation, never changes
        uint256 goal;          // Target amount in token atomic units
        uint256 deadline;      // Unix timestamp — campaign ends when block.timestamp >= this
        uint256 totalRaised;   // Running sum of all donations
        bool withdrawn;        // True after creator calls withdraw — prevents double withdrawal
        bool active;           // False after withdrawal or admin deactivation
        uint8 fundingModel;    // 0 = Flexible, 1 = All-or-Nothing
    }

    // -------------------------------------------------------
    // STATE VARIABLES
    // -------------------------------------------------------

    // All campaigns. Key is the campaign ID (starts at 1).
    mapping(uint256 => Campaign) public campaigns;

    // How much each address donated to each campaign.
    // donations[campaignId][donorAddress] = amount donated
    mapping(uint256 => mapping(address => uint256)) public donations;

    // Which token addresses the contract accepts.
    // Only cUSD and USDC are whitelisted.
    mapping(address => bool) public allowedTokens;

    // Counter for campaign IDs. Starts at 0.
    // First campaign created gets ID 1 (we increment before assigning).
    uint256 public campaignCount;

    // -------------------------------------------------------
    // CONSTRUCTOR
    // Runs once when the contract is deployed.
    // Sets the owner and whitelists the initial tokens.
    // -------------------------------------------------------

    constructor(address cusd, address usdc) {
        // The deployer address becomes the permanent owner
        owner = msg.sender;
        // Whitelist both tokens at deployment
        allowedTokens[cusd] = true;
        allowedTokens[usdc] = true;
    }

    // -------------------------------------------------------
    // MODIFIERS
    // Reusable checks that run before a function body.
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
    // READ FUNCTIONS (cost no gas to call)
    // -------------------------------------------------------

    /// @notice Returns the full data for a campaign
    function getCampaign(uint256 id)
        external
        view
        campaignExists(id)
        returns (Campaign memory)
    {
        return campaigns[id];
    }

    /// @notice Returns how much a specific address donated to a campaign
    function getDonation(uint256 campaignId, address donor)
        external
        view
        returns (uint256)
    {
        return donations[campaignId][donor];
    }

    /// @notice Calculates the 2% platform fee on an amount
    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
    }

    /// @notice Calculates what the creator receives after the fee is deducted
    function calculateNet(uint256 amount) public pure returns (uint256) {
        return amount - calculateFee(amount);
    }

    /// @notice Returns true if the campaign deadline has passed
    function isPastDeadline(uint256 id)
        external
        view
        campaignExists(id)
        returns (bool)
    {
        return block.timestamp >= campaigns[id].deadline;
    }

    /// @notice Returns true if the campaign has met or exceeded its goal
    function isGoalReached(uint256 id)
        external
        view
        campaignExists(id)
        returns (bool)
    {
        Campaign memory c = campaigns[id];
        return c.totalRaised >= c.goal;
    }

    // -------------------------------------------------------
    // CREATE CAMPAIGN
    // -------------------------------------------------------

    /// @notice Creates a new fundraising campaign
    /// @param token         Address of cUSD or USDC on the current network
    /// @param goal          Funding target in token atomic units
    ///                      Example for cUSD (18 decimals): 1000 cUSD = 1000 * 10^18
    ///                      Example for USDC (6 decimals):  1000 USDC = 1000 * 10^6
    /// @param duration      How long the campaign runs, in seconds
    ///                      Example: 30 days = 30 * 24 * 60 * 60 = 2592000 seconds
    /// @param fundingModel  0 for Flexible, 1 for All-or-Nothing
    /// @return id           The ID assigned to the new campaign

    function createCampaign(
        address token,
        uint256 goal,
        uint256 duration,
        uint8 fundingModel
    ) external returns (uint256 id) {
        if (!allowedTokens[token])                                      revert TokenNotAllowed();
        if (goal == 0)                                                   revert InvalidAmount();
        if (duration == 0)                                               revert InvalidAmount();
        if (fundingModel != FLEXIBLE && fundingModel != ALL_OR_NOTHING)  revert InvalidModel();

        // Increment first, then assign — campaign IDs start at 1
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

    /// @notice Sends tokens to the campaign escrow
    ///
    /// IMPORTANT: Before calling this function, the donor must
    /// approve this contract to spend `amount` of the campaign token.
    /// This is done in two steps from the frontend:
    ///   Step 1: Call token.approve(escrowAddress, amount)
    ///   Step 2: Call escrow.donate(id, amount)
    ///
    /// @param id      The campaign ID
    /// @param amount  Amount to donate in token atomic units

    function donate(uint256 id, uint256 amount) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (!c.active)                          revert Inactive();
        if (block.timestamp >= c.deadline)      revert Expired();
        if (amount == 0)                        revert InvalidAmount();

        // Pull tokens from the donor into this contract.
        // SafeERC20.safeTransferFrom handles tokens that do not return a bool.
        IERC20(c.token).safeTransferFrom(msg.sender, address(this), amount);

        // Add to this donor's running total for this campaign
        donations[id][msg.sender] += amount;

        // Update the campaign's overall total
        c.totalRaised += amount;

        emit DonationReceived(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // WITHDRAW
    // -------------------------------------------------------

    /// @notice Creator withdraws escrowed funds after campaign ends
    ///
    /// Rules:
    ///   Flexible      — callable any time after deadline
    ///   All-or-Nothing — callable after deadline ONLY if goal was reached
    ///
    /// Fee split:
    ///   2%  → contract owner (platform fee)
    ///   98% → campaign creator
    ///
    /// REENTRANCY PROTECTION:
    ///   The withdrawn flag and active flag are set to true/false
    ///   BEFORE any token transfer. This means even if a malicious
    ///   token tried to call back into this contract, the state
    ///   would already reflect a completed withdrawal.

    function withdraw(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (msg.sender != c.creator)            revert NotCreator();
        if (c.withdrawn)                        revert AlreadyWithdrawn();
        if (block.timestamp < c.deadline)       revert StillActive();

        // For All-or-Nothing: block withdrawal if goal not reached
        if (c.fundingModel == ALL_OR_NOTHING && c.totalRaised < c.goal) {
            revert GoalNotReached();
        }

        uint256 raised = c.totalRaised;
        uint256 fee    = calculateFee(raised);
        uint256 net    = raised - fee;

        // STATE UPDATE BEFORE TRANSFERS — reentrancy protection
        c.withdrawn = true;
        c.active    = false;

        // Send 2% to protocol owner
        IERC20(c.token).safeTransfer(owner, fee);

        // Send 98% to creator
        IERC20(c.token).safeTransfer(c.creator, net);

        emit FundsWithdrawn(id, c.creator, net, fee);
    }

    // -------------------------------------------------------
    // CLAIM REFUND
    // -------------------------------------------------------

    /// @notice Donor reclaims their full donation from a failed campaign
    ///
    /// Eligible ONLY when ALL THREE of these are true:
    ///   1. Campaign funding model is All-or-Nothing
    ///   2. Campaign deadline has passed
    ///   3. Campaign total raised is less than the goal
    ///
    /// Full donation returned. No fee is taken on refunds.
    ///
    /// DOUBLE-CLAIM PROTECTION:
    ///   The donation record is zeroed out BEFORE the transfer.
    ///   If someone tried to call this twice, the second call would
    ///   hit the NotDonor check because their balance is already 0.

    function claimRefund(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];
        uint256 amount = donations[id][msg.sender];

        if (c.fundingModel != ALL_OR_NOTHING)   revert RefundNotAllowed();
        if (block.timestamp < c.deadline)       revert StillActive();
        if (c.totalRaised >= c.goal)            revert RefundNotAllowed();
        if (amount == 0)                        revert NotDonor();

        // ZERO OUT BEFORE TRANSFER — double-claim protection
        donations[id][msg.sender] = 0;

        // Return full donation to donor
        IERC20(c.token).safeTransfer(msg.sender, amount);

        emit RefundClaimed(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // ADMIN — EMERGENCY DEACTIVATE
    // -------------------------------------------------------

    /// @notice Stops new donations to a campaign (owner only)
    ///
    /// This does NOT move any funds. Escrowed tokens remain in
    /// the contract. The creator can still withdraw (if eligible)
    /// and donors can still claim refunds (if eligible).
    /// This is purely a circuit breaker for emergencies.

    function deactivateCampaign(uint256 id) external onlyOwner campaignExists(id) {
        campaigns[id].active = false;
        emit CampaignDeactivated(id);
    }

    // -------------------------------------------------------
    // ADMIN — MANAGE TOKEN WHITELIST
    // -------------------------------------------------------

    /// @notice Add or remove a token from the whitelist
    ///
    /// Removing a token does NOT affect campaigns already using it.
    /// It only prevents NEW campaigns from selecting that token.

    function setAllowedToken(address token, bool allowed) external onlyOwner {
        allowedTokens[token] = allowed;
    }
}
```

- [ ] Contract written and saved

---

## 2.2 — Compile the contract

**Action:** From inside the `contracts/` folder:

```bash
forge build
```

**You should see:**

```
[⠒] Compiling...
[⠢] Compiling 1 files with 0.8.20
[⠆] Solc 0.8.20 finished in X.XXs
Compiler run successful!
```

**If you see errors:**
- `File not found` — the OpenZeppelin remapping in `foundry.toml` is wrong. Double-check Step 1.4.
- `Identifier not declared` — you have a typo in a function or variable name. Read the error line number and fix it.
- `Expected ';' but got` — missing semicolon somewhere. Check the line number in the error.

- [ ] `forge build` runs with no errors

---

## Phase 2 Checkpoint

```
[ ] FundXEscrow.sol is written and saved
[ ] forge build completes with Compiler run successful
[ ] No errors or warnings that say "Error:"
```

---

---

# PHASE 3 — Smart Contract: Test

**Goal:** Write tests that cover every function and every error condition, then run them all to green.

---

## 3.1 — Understand how Foundry tests work

Foundry tests are written in Solidity. Each test is a function that starts with `test_`. Foundry runs them and reports pass or fail.

Key tools:
- `vm.prank(address)` — pretend to be a different address for the next call
- `vm.expectRevert(error)` — assert that the next call reverts with a specific error
- `deal(token, address, amount)` — give an address a token balance (testnet simulation)
- `assertEq(a, b)` — assert two values are equal
- `assertTrue(x)` — assert something is true

---

## 3.2 — Write the test file

Open `test/FundXEscrow.t.sol` and paste the following:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FundXEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ================================================================
// MOCK TOKEN
// A simple ERC20 we control for testing.
// We mint tokens to addresses as needed.
// ================================================================

contract MockERC20 is ERC20 {
    uint8 private _dec;

    constructor(string memory name, string memory symbol, uint8 dec)
        ERC20(name, symbol)
    {
        _dec = dec;
    }

    function decimals() public view override returns (uint8) {
        return _dec;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// ================================================================
// TEST CONTRACT
// ================================================================

contract FundXEscrowTest is Test {

    FundXEscrow escrow;
    MockERC20   cusd;
    MockERC20   usdc;
    MockERC20   randomToken;   // Not whitelisted

    // Test addresses
    address owner   = address(0x1);
    address alice   = address(0x2);  // Campaign creator
    address bob     = address(0x3);  // Donor 1
    address carol   = address(0x4);  // Donor 2

    // Shorthand amounts
    uint256 constant ONE_CUSD  = 1e18;
    uint256 constant ONE_USDC  = 1e6;
    uint256 constant GOAL_CUSD = 1000 * 1e18;   // 1000 cUSD
    uint256 constant GOAL_USDC = 1000 * 1e6;    // 1000 USDC
    uint256 constant THIRTY_DAYS = 30 days;

    function setUp() public {
        // Deploy mock tokens
        cusd        = new MockERC20("Celo Dollar", "cUSD", 18);
        usdc        = new MockERC20("USD Coin", "USDC", 6);
        randomToken = new MockERC20("Random", "RND", 18);

        // Deploy escrow as `owner`
        vm.prank(owner);
        escrow = new FundXEscrow(address(cusd), address(usdc));

        // Give alice, bob, carol some cUSD and USDC
        cusd.mint(alice, 10_000 * ONE_CUSD);
        cusd.mint(bob,   10_000 * ONE_CUSD);
        cusd.mint(carol, 10_000 * ONE_CUSD);
        usdc.mint(alice, 10_000 * ONE_USDC);
        usdc.mint(bob,   10_000 * ONE_USDC);

        // Approve escrow to spend their tokens
        vm.prank(alice); cusd.approve(address(escrow), type(uint256).max);
        vm.prank(bob);   cusd.approve(address(escrow), type(uint256).max);
        vm.prank(carol); cusd.approve(address(escrow), type(uint256).max);
        vm.prank(alice); usdc.approve(address(escrow), type(uint256).max);
        vm.prank(bob);   usdc.approve(address(escrow), type(uint256).max);
    }

    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------

    function _createFlexibleCusd() internal returns (uint256) {
        vm.prank(alice);
        return escrow.createCampaign(address(cusd), GOAL_CUSD, THIRTY_DAYS, 0);
    }

    function _createAllOrNothingCusd() internal returns (uint256) {
        vm.prank(alice);
        return escrow.createCampaign(address(cusd), GOAL_CUSD, THIRTY_DAYS, 1);
    }

    // -------------------------------------------------------
    // CREATE CAMPAIGN TESTS
    // -------------------------------------------------------

    function test_CreateCampaign_Flexible_Success() public {
        uint256 id = _createFlexibleCusd();
        assertEq(id, 1);

        FundXEscrow.Campaign memory c = escrow.getCampaign(1);
        assertEq(c.creator,      alice);
        assertEq(c.token,        address(cusd));
        assertEq(c.goal,         GOAL_CUSD);
        assertEq(c.fundingModel, 0);
        assertTrue(c.active);
        assertFalse(c.withdrawn);
        assertEq(c.totalRaised,  0);
    }

    function test_CreateCampaign_AllOrNothing_Success() public {
        uint256 id = _createAllOrNothingCusd();
        assertEq(id, 1);

        FundXEscrow.Campaign memory c = escrow.getCampaign(1);
        assertEq(c.fundingModel, 1);
    }

    function test_CreateCampaign_USDC_Success() public {
        vm.prank(alice);
        uint256 id = escrow.createCampaign(address(usdc), GOAL_USDC, THIRTY_DAYS, 0);
        assertEq(id, 1);

        FundXEscrow.Campaign memory c = escrow.getCampaign(1);
        assertEq(c.token, address(usdc));
    }

    function test_CreateCampaign_Reverts_TokenNotAllowed() public {
        vm.prank(alice);
        vm.expectRevert(FundXEscrow.TokenNotAllowed.selector);
        escrow.createCampaign(address(randomToken), GOAL_CUSD, THIRTY_DAYS, 0);
    }

    function test_CreateCampaign_Reverts_ZeroGoal() public {
        vm.prank(alice);
        vm.expectRevert(FundXEscrow.InvalidAmount.selector);
        escrow.createCampaign(address(cusd), 0, THIRTY_DAYS, 0);
    }

    function test_CreateCampaign_Reverts_ZeroDuration() public {
        vm.prank(alice);
        vm.expectRevert(FundXEscrow.InvalidAmount.selector);
        escrow.createCampaign(address(cusd), GOAL_CUSD, 0, 0);
    }

    function test_CreateCampaign_Reverts_InvalidModel() public {
        vm.prank(alice);
        vm.expectRevert(FundXEscrow.InvalidModel.selector);
        escrow.createCampaign(address(cusd), GOAL_CUSD, THIRTY_DAYS, 2);
    }

    function test_CreateCampaign_IDs_Increment() public {
        uint256 id1 = _createFlexibleCusd();
        uint256 id2 = _createFlexibleCusd();
        uint256 id3 = _createFlexibleCusd();
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(id3, 3);
    }

    // -------------------------------------------------------
    // DONATE TESTS
    // -------------------------------------------------------

    function test_Donate_Success() public {
        uint256 id = _createFlexibleCusd();

        uint256 bobBalanceBefore = cusd.balanceOf(bob);

        vm.prank(bob);
        escrow.donate(id, 100 * ONE_CUSD);

        FundXEscrow.Campaign memory c = escrow.getCampaign(id);
        assertEq(c.totalRaised, 100 * ONE_CUSD);
        assertEq(escrow.getDonation(id, bob), 100 * ONE_CUSD);
        assertEq(cusd.balanceOf(bob), bobBalanceBefore - 100 * ONE_CUSD);
        assertEq(cusd.balanceOf(address(escrow)), 100 * ONE_CUSD);
    }

    function test_Donate_Accumulates_MultipleDonations() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);
        vm.prank(bob); escrow.donate(id, 200 * ONE_CUSD);

        assertEq(escrow.getDonation(id, bob), 300 * ONE_CUSD);
        assertEq(escrow.getCampaign(id).totalRaised, 300 * ONE_CUSD);
    }

    function test_Donate_MultipledonorS() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(bob);   escrow.donate(id, 100 * ONE_CUSD);
        vm.prank(carol); escrow.donate(id, 200 * ONE_CUSD);

        assertEq(escrow.getCampaign(id).totalRaised, 300 * ONE_CUSD);
        assertEq(escrow.getDonation(id, bob),   100 * ONE_CUSD);
        assertEq(escrow.getDonation(id, carol), 200 * ONE_CUSD);
    }

    function test_Donate_Reverts_CampaignNotFound() public {
        vm.prank(bob);
        vm.expectRevert(FundXEscrow.NotFound.selector);
        escrow.donate(999, 100 * ONE_CUSD);
    }

    function test_Donate_Reverts_AfterDeadline() public {
        uint256 id = _createFlexibleCusd();
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.Expired.selector);
        escrow.donate(id, 100 * ONE_CUSD);
    }

    function test_Donate_Reverts_ZeroAmount() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.InvalidAmount.selector);
        escrow.donate(id, 0);
    }

    function test_Donate_Reverts_WhenInactive() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(owner);
        escrow.deactivateCampaign(id);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.Inactive.selector);
        escrow.donate(id, 100 * ONE_CUSD);
    }

    // -------------------------------------------------------
    // WITHDRAW TESTS — FLEXIBLE
    // -------------------------------------------------------

    function test_Withdraw_Flexible_GoalReached() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(bob); escrow.donate(id, GOAL_CUSD);

        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        uint256 aliceBalanceBefore = cusd.balanceOf(alice);
        uint256 ownerBalanceBefore = cusd.balanceOf(owner);

        vm.prank(alice);
        escrow.withdraw(id);

        uint256 fee = escrow.calculateFee(GOAL_CUSD);
        uint256 net = GOAL_CUSD - fee;

        assertEq(cusd.balanceOf(alice), aliceBalanceBefore + net);
        assertEq(cusd.balanceOf(owner), ownerBalanceBefore + fee);
        assertTrue(escrow.getCampaign(id).withdrawn);
        assertFalse(escrow.getCampaign(id).active);
    }

    function test_Withdraw_Flexible_BelowGoal_StillSucceeds() public {
        uint256 id = _createFlexibleCusd();

        // Only raised half the goal
        vm.prank(bob); escrow.donate(id, GOAL_CUSD / 2);

        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(alice);
        escrow.withdraw(id); // Should NOT revert — Flexible model

        assertTrue(escrow.getCampaign(id).withdrawn);
    }

    function test_Withdraw_Reverts_BeforeDeadline() public {
        uint256 id = _createFlexibleCusd();
        vm.prank(bob); escrow.donate(id, GOAL_CUSD);

        vm.prank(alice);
        vm.expectRevert(FundXEscrow.StillActive.selector);
        escrow.withdraw(id);
    }

    function test_Withdraw_Reverts_NotCreator() public {
        uint256 id = _createFlexibleCusd();
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.NotCreator.selector);
        escrow.withdraw(id);
    }

    function test_Withdraw_Reverts_AlreadyWithdrawn() public {
        uint256 id = _createFlexibleCusd();
        vm.prank(bob); escrow.donate(id, GOAL_CUSD);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(alice); escrow.withdraw(id);

        vm.prank(alice);
        vm.expectRevert(FundXEscrow.AlreadyWithdrawn.selector);
        escrow.withdraw(id);
    }

    // -------------------------------------------------------
    // WITHDRAW TESTS — ALL-OR-NOTHING
    // -------------------------------------------------------

    function test_Withdraw_AllOrNothing_GoalReached_Succeeds() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, GOAL_CUSD);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(alice);
        escrow.withdraw(id); // Should succeed — goal was met
    }

    function test_Withdraw_AllOrNothing_GoalNotReached_Reverts() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, GOAL_CUSD / 2); // Only half
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(alice);
        vm.expectRevert(FundXEscrow.GoalNotReached.selector);
        escrow.withdraw(id);
    }

    // -------------------------------------------------------
    // CLAIM REFUND TESTS
    // -------------------------------------------------------

    function test_ClaimRefund_Success() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);

        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        uint256 bobBalanceBefore = cusd.balanceOf(bob);

        vm.prank(bob);
        escrow.claimRefund(id);

        assertEq(cusd.balanceOf(bob), bobBalanceBefore + 100 * ONE_CUSD);
        assertEq(escrow.getDonation(id, bob), 0);
    }

    function test_ClaimRefund_NoFeeCharged() public {
        uint256 id = _createAllOrNothingCusd();
        uint256 donateAmount = 100 * ONE_CUSD;

        vm.prank(bob); escrow.donate(id, donateAmount);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        uint256 bobBalanceBefore = cusd.balanceOf(bob);

        vm.prank(bob); escrow.claimRefund(id);

        // Bob should get exactly what he put in — no fee on refunds
        assertEq(cusd.balanceOf(bob), bobBalanceBefore + donateAmount);
    }

    function test_ClaimRefund_Reverts_FlexibleCampaign() public {
        uint256 id = _createFlexibleCusd();  // Flexible, not All-or-Nothing
        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.RefundNotAllowed.selector);
        escrow.claimRefund(id);
    }

    function test_ClaimRefund_Reverts_GoalWasReached() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, GOAL_CUSD); // Full goal
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.RefundNotAllowed.selector);
        escrow.claimRefund(id);
    }

    function test_ClaimRefund_Reverts_BeforeDeadline() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);

        // Don't warp — deadline hasn't passed
        vm.prank(bob);
        vm.expectRevert(FundXEscrow.StillActive.selector);
        escrow.claimRefund(id);
    }

    function test_ClaimRefund_Reverts_NotDonor() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(carol); // Carol never donated
        vm.expectRevert(FundXEscrow.NotDonor.selector);
        escrow.claimRefund(id);
    }

    function test_ClaimRefund_Reverts_DoubleClaim() public {
        uint256 id = _createAllOrNothingCusd();
        vm.prank(bob); escrow.donate(id, 100 * ONE_CUSD);
        vm.warp(block.timestamp + THIRTY_DAYS + 1);

        vm.prank(bob); escrow.claimRefund(id);

        vm.prank(bob);
        vm.expectRevert(FundXEscrow.NotDonor.selector);
        escrow.claimRefund(id); // Second attempt must fail
    }

    // -------------------------------------------------------
    // FEE CALCULATION TESTS
    // -------------------------------------------------------

    function test_Fee_TwoPercent() public view {
        uint256 amount = 10_000 * ONE_CUSD;
        uint256 fee    = escrow.calculateFee(amount);
        uint256 net    = escrow.calculateNet(amount);

        assertEq(fee, 200 * ONE_CUSD);  // 2% of 10,000 = 200
        assertEq(net, 9_800 * ONE_CUSD); // 98% of 10,000 = 9,800
        assertEq(fee + net, amount);     // Fee + Net must equal total
    }

    // -------------------------------------------------------
    // ADMIN TESTS
    // -------------------------------------------------------

    function test_DeactivateCampaign_Success() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(owner);
        escrow.deactivateCampaign(id);

        assertFalse(escrow.getCampaign(id).active);
    }

    function test_DeactivateCampaign_Reverts_NotOwner() public {
        uint256 id = _createFlexibleCusd();

        vm.prank(alice); // Alice is not the owner
        vm.expectRevert(FundXEscrow.NotOwner.selector);
        escrow.deactivateCampaign(id);
    }

    function test_SetAllowedToken_Success() public {
        address newToken = address(0x999);
        assertFalse(escrow.allowedTokens(newToken));

        vm.prank(owner);
        escrow.setAllowedToken(newToken, true);

        assertTrue(escrow.allowedTokens(newToken));
    }
}
```

- [ ] Test file written and saved

---

## 3.3 — Run the tests

**Action:**

```bash
forge test -vvv
```

The `-vvv` flag gives you verbose output so you can see which test passed and which failed.

**You should see:**

```
Running 30 tests for test/FundXEscrow.t.sol:FundXEscrowTest
[PASS] test_ClaimRefund_NoFeeCharged() (gas: ...)
[PASS] test_ClaimRefund_Reverts_BeforeDeadline() (gas: ...)
[PASS] test_ClaimRefund_Reverts_DoubleClaim() (gas: ...)
...
[PASS] test_Withdraw_Reverts_NotCreator() (gas: ...)

Test result: ok. 30 passed; 0 failed; 0 skipped;
```

**Every test must pass. Zero failures.**

**If a test fails:**
- Read the failure message — it shows the function, the line, and what was expected vs what actually happened
- Reread the contract logic for that function
- Fix the contract (or the test if the test had wrong expectations) and run again

- [ ] All tests pass with 0 failures

---

## 3.4 — Check test coverage

**Action:**

```bash
forge coverage
```

**You should see** a coverage table. Aim for over 90% line coverage. Every public function should be covered.

- [ ] Coverage checked

---

## Phase 3 Checkpoint

```
[ ] Test file written
[ ] forge test -vvv shows 0 failures
[ ] Every public function has at least one test
```

---

---

# PHASE 4 — Smart Contract: Deploy to Testnet

**Goal:** Deploy the contract to Celo Alfajores testnet and verify it on Celoscan.

---

## 4.1 — Write the deployment script

Open `script/Deploy.s.sol` and paste:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FundXEscrow.sol";

contract Deploy is Script {

    // Alfajores testnet token addresses
    address constant CUSD_ALFAJORES = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address constant USDC_ALFAJORES = address(0); // Use a testnet faucet USDC or mock

    // Mainnet token addresses (used when deploying to mainnet)
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address constant USDC_MAINNET = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C;

    function run() external {
        // Load private key from .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Detect which network we are on
        // Alfajores chain ID = 44787
        // Celo mainnet chain ID = 42220
        bool isMainnet = block.chainid == 42220;

        address cusd = isMainnet ? CUSD_MAINNET : CUSD_ALFAJORES;
        address usdc = isMainnet ? USDC_MAINNET : USDC_ALFAJORES;

        vm.startBroadcast(deployerPrivateKey);

        FundXEscrow escrow = new FundXEscrow(cusd, usdc);

        vm.stopBroadcast();

        // Log the deployed address — copy this for your frontend
        console.log("==============================================");
        console.log("FundXEscrow deployed on chain:", block.chainid);
        console.log("Contract address:", address(escrow));
        console.log("cUSD address used:", cusd);
        console.log("USDC address used:", usdc);
        console.log("Owner (deployer):", vm.addr(deployerPrivateKey));
        console.log("==============================================");
    }
}
```

- [ ] Deploy script written and saved

---

## 4.2 — Load your environment variables

**Action:**

```bash
source .env
```

This loads your `PRIVATE_KEY`, `ALFAJORES_RPC`, and other variables into your terminal session.

- [ ] Environment variables loaded

---

## 4.3 — Deploy to Alfajores

**Action:**

```bash
forge script script/Deploy.s.sol \
  --rpc-url $ALFAJORES_RPC \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://alfajores.celoscan.io/api \
  -vvv
```

**You should see:**

```
== Logs ==
==============================================
FundXEscrow deployed on chain: 44787
Contract address: 0xYourContractAddressHere
cUSD address used: 0x874069...
USDC address used: 0x000000...
Owner (deployer): 0xYourDeployerAddress
==============================================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.
```

**Copy the contract address. You will need it in the frontend.**

- [ ] Contract deployed to Alfajores
- [ ] Contract address copied and saved

---

## 4.4 — Verify the contract on Celoscan

If verification did not happen automatically in the previous step:

```bash
forge verify-contract \
  0xYourContractAddress \
  src/FundXEscrow.sol:FundXEscrow \
  --chain-id 44787 \
  --verifier blockscout \
  --verifier-url https://alfajores.celoscan.io/api
```

Then go to `https://alfajores.celoscan.io/address/0xYourContractAddress`.

**You should see** your contract source code on the Celoscan page with a green verified checkmark.

- [ ] Contract verified on Alfajores Celoscan

---

## 4.5 — Smoke test on testnet

**Action:** Use Celoscan's Read Contract tab to call `getCampaign(1)` — it should revert with `NotFound` because no campaigns exist yet. This confirms the contract is live and working.

You can also use `cast`:

```bash
cast call 0xYourContractAddress "campaignCount()" --rpc-url $ALFAJORES_RPC
```

**You should see:** `0x0000000000000000000000000000000000000000000000000000000000000000` (zero — no campaigns yet)

- [ ] Smoke test passed

---

## Phase 4 Checkpoint

```
[ ] Deploy script written
[ ] Contract deployed to Alfajores
[ ] Contract address saved
[ ] Contract verified on Celoscan
[ ] Smoke test confirmed contract is live
```

---

---

# PHASE 5 — Frontend: Setup

**Goal:** Initialize the Next.js project, install all dependencies, and confirm the dev server runs.

---

## 5.1 — Go back to the project root

```bash
cd ..   # If you are inside the contracts folder
# You should now be in /fundx
```

- [ ] In the fundx root folder

---

## 5.2 — Create the Next.js app

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
```

Answer the prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: Yes, use `@/*`

- [ ] Next.js project created

---

## 5.3 — Install blockchain dependencies

```bash
npm install viem wagmi @tanstack/react-query
```

**What each package does:**
- `viem` — low-level library for reading from and writing to EVM blockchains
- `wagmi` — React hooks built on top of viem for wallet connection and contract calls
- `@tanstack/react-query` — data fetching and caching, required by wagmi

- [ ] Blockchain dependencies installed

---

## 5.4 — Install UI dependencies

```bash
npm install lucide-react class-variance-authority clsx tailwind-merge
npx shadcn@latest init
```

When `shadcn init` prompts you, accept all defaults.

Then install the components you need:

```bash
npx shadcn@latest add button input label select textarea card badge progress dialog
```

- [ ] UI dependencies installed

---

## 5.5 — Confirm the dev server runs

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`.

**You should see** the default Next.js welcome page.

Press `Ctrl+C` to stop the server.

- [ ] Dev server runs without errors

---

## 5.6 — Create the folder structure

```bash
mkdir -p src/lib src/hooks src/types src/components/campaign src/components/donation src/components/withdraw src/components/refund src/components/wallet src/components/layout
```

- [ ] Folder structure created

---

## 5.7 — Create the environment file for the frontend

```bash
touch .env.local
```

Open `.env.local` and add:

```
NEXT_PUBLIC_FUNDX_CONTRACT=0xYourContractAddressFromPhase4
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org
```

Replace `0xYourContractAddressFromPhase4` with the address you saved in Phase 4.3.

```bash
echo ".env.local" >> .gitignore
```

- [ ] Frontend .env.local created
- [ ] .env.local added to .gitignore

---

## Phase 5 Checkpoint

```
[ ] Next.js project created and running
[ ] viem, wagmi, tanstack/react-query installed
[ ] shadcn/ui initialized and components added
[ ] Folder structure created
[ ] .env.local populated with contract address
```

---

---

# PHASE 6 — Frontend: Wallet & Token Layer

**Goal:** Build the foundational files that every other frontend file depends on.

---

## 6.1 — Create the constants file

Create `src/lib/constants.ts`:

```typescript
export const FUNDX_CONTRACT = process.env.NEXT_PUBLIC_FUNDX_CONTRACT as `0x${string}`
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

export const CUSD_ALFAJORES = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as `0x${string}`
export const USDC_ALFAJORES = "0x" as `0x${string}` // Update when you have testnet USDC

export const CUSD_MAINNET   = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`
export const USDC_MAINNET   = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as `0x${string}`

export const IS_MAINNET = CHAIN_ID === 42220

export const CUSD = IS_MAINNET ? CUSD_MAINNET : CUSD_ALFAJORES
export const USDC = IS_MAINNET ? USDC_MAINNET : USDC_ALFAJORES
```

- [ ] constants.ts created

---

## 6.2 — Create the token configuration file

Create `src/lib/tokens.ts`:

```typescript
import { formatUnits, parseUnits } from "viem"
import { CUSD, USDC } from "./constants"

export type TokenSymbol = "cUSD" | "USDC"

export interface Token {
  symbol:   TokenSymbol
  address:  `0x${string}`
  decimals: number
  color:    string
  bgColor:  string
  label:    string
}

export const TOKENS: Record<TokenSymbol, Token> = {
  cUSD: {
    symbol:   "cUSD",
    address:  CUSD,
    decimals: 18,
    color:    "text-emerald-600",
    bgColor:  "bg-emerald-50",
    label:    "cUSD — Celo Dollar (MiniPay native)",
  },
  USDC: {
    symbol:   "USDC",
    address:  USDC,
    decimals: 6,
    color:    "text-blue-600",
    bgColor:  "bg-blue-50",
    label:    "USDC — USD Coin",
  },
}

export function getTokenByAddress(address: string): Token | undefined {
  return Object.values(TOKENS).find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  )
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  return Number(formatUnits(amount, decimals)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals)
  } catch {
    return 0n
  }
}
```

- [ ] tokens.ts created

---

## 6.3 — Create the time utility

Create `src/lib/time.ts`:

```typescript
export function daysRemaining(deadline: number): number {
  const now   = Math.floor(Date.now() / 1000)
  const diff  = deadline - now
  if (diff <= 0) return 0
  return Math.ceil(diff / 86400)
}

export function formatDeadline(deadline: number): string {
  const days = daysRemaining(deadline)
  if (days === 0) return "Ended"
  if (days === 1) return "1 day left"
  return `${days} days left`
}

export function daysToSeconds(days: number): number {
  return days * 86400
}

export function isPastDeadline(deadline: number): boolean {
  return Math.floor(Date.now() / 1000) >= deadline
}
```

- [ ] time.ts created

---

## 6.4 — Create the fee utility

Create `src/lib/fee.ts`:

```typescript
// Mirrors the contract's fee logic exactly.
// Always keep this in sync with the contract constants.

const PLATFORM_FEE_BPS = 200n
const BPS_DENOMINATOR  = 10000n

export function calculateFee(amount: bigint): bigint {
  return (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR
}

export function calculateNet(amount: bigint): bigint {
  return amount - calculateFee(amount)
}
```

- [ ] fee.ts created

---

## 6.5 — Create the error mapping

Create `src/lib/errors.ts`:

```typescript
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

- [ ] errors.ts created

---

## 6.6 — Create the ABI file

Create `src/lib/abi.ts`.

This is the contract's ABI — the list of all functions and their inputs/outputs. Your frontend uses this to talk to the contract.

```typescript
export const FUNDX_ABI = [
  // Read functions
  {
    name: "getCampaign",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "id", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "creator",      type: "address" },
        { name: "token",        type: "address" },
        { name: "goal",         type: "uint256" },
        { name: "deadline",     type: "uint256" },
        { name: "totalRaised",  type: "uint256" },
        { name: "withdrawn",    type: "bool"    },
        { name: "active",       type: "bool"    },
        { name: "fundingModel", type: "uint8"   },
      ],
    }],
  },
  {
    name: "getDonation",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "campaignId", type: "uint256" }, { name: "donor", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "campaignCount",
    type: "function",
    stateMutability: "view",
    inputs:  [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "calculateFee",
    type: "function",
    stateMutability: "pure",
    inputs:  [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowedTokens",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "token", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  // Write functions
  {
    name: "createCampaign",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token",        type: "address" },
      { name: "goal",         type: "uint256" },
      { name: "duration",     type: "uint256" },
      { name: "fundingModel", type: "uint8"   },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    name: "donate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id",     type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs:  [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    name: "claimRefund",
    type: "function",
    stateMutability: "nonpayable",
    inputs:  [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  // Events
  {
    name: "CampaignCreated",
    type: "event",
    inputs: [
      { name: "campaignId",  type: "uint256", indexed: true  },
      { name: "creator",     type: "address", indexed: true  },
      { name: "token",       type: "address", indexed: false },
      { name: "goal",        type: "uint256", indexed: false },
      { name: "deadline",    type: "uint256", indexed: false },
      { name: "fundingModel",type: "uint8",   indexed: false },
    ],
  },
  {
    name: "DonationReceived",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true  },
      { name: "donor",      type: "address", indexed: true  },
      { name: "amount",     type: "uint256", indexed: false },
    ],
  },
  {
    name: "FundsWithdrawn",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true  },
      { name: "creator",    type: "address", indexed: true  },
      { name: "net",        type: "uint256", indexed: false },
      { name: "fee",        type: "uint256", indexed: false },
    ],
  },
  {
    name: "RefundClaimed",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true  },
      { name: "donor",      type: "address", indexed: true  },
      { name: "amount",     type: "uint256", indexed: false },
    ],
  },
] as const
```

- [ ] abi.ts created

---

## Phase 6 Checkpoint

```
[ ] constants.ts
[ ] tokens.ts
[ ] time.ts
[ ] fee.ts
[ ] errors.ts
[ ] abi.ts
```

All six files created with no TypeScript errors (run `npx tsc --noEmit` to check).

---

---

# PHASE 7 — Frontend: Contract Integration

**Goal:** Build the wagmi configuration and the contract abstraction layer.

---

## 7.1 — Configure wagmi

Create `src/lib/wagmi.ts`:

```typescript
import { createConfig, http } from "wagmi"
import { celo, celoAlfajores } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { IS_MAINNET } from "./constants"

export const wagmiConfig = createConfig({
  chains: IS_MAINNET ? [celo] : [celoAlfajores],
  connectors: [injected()],
  transports: IS_MAINNET
    ? { [celo.id]: http() }
    : { [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org") },
})
```

- [ ] wagmi.ts created

---

## 7.2 — Create the providers wrapper

Create `src/components/layout/Providers.tsx`:

```tsx
"use client"

import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@/lib/wagmi"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

- [ ] Providers.tsx created

---

## 7.3 — Wrap the app in providers

Open `src/app/layout.tsx` and wrap the children:

```tsx
import { Providers } from "@/components/layout/Providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] layout.tsx updated

---

## 7.4 — Create the contract interaction library

Create `src/lib/contract.ts`:

```typescript
import { createPublicClient, createWalletClient, custom, http } from "viem"
import { celo, celoAlfajores } from "viem/chains"
import { FUNDX_ABI } from "./abi"
import { FUNDX_CONTRACT, IS_MAINNET } from "./constants"

const chain = IS_MAINNET ? celo : celoAlfajores

const publicClient = createPublicClient({
  chain,
  transport: http(),
})

function getWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet found")
  }
  return createWalletClient({
    chain,
    transport: custom(window.ethereum),
  })
}

// -------------------------------------------------------
// READ FUNCTIONS
// -------------------------------------------------------

export async function getCampaign(id: number) {
  return publicClient.readContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "getCampaign",
    args:    [BigInt(id)],
  })
}

export async function getCampaignCount(): Promise<number> {
  const count = await publicClient.readContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "campaignCount",
  })
  return Number(count)
}

export async function getDonation(campaignId: number, donor: string): Promise<bigint> {
  return publicClient.readContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "getDonation",
    args:    [BigInt(campaignId), donor as `0x${string}`],
  }) as Promise<bigint>
}

// -------------------------------------------------------
// WRITE FUNCTIONS
// -------------------------------------------------------

export async function createCampaign(
  token:        `0x${string}`,
  goal:         bigint,
  duration:     number,
  fundingModel: 0 | 1,
): Promise<`0x${string}`> {
  const wallet  = getWalletClient()
  const [account] = await wallet.getAddresses()
  return wallet.writeContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "createCampaign",
    args:    [token, goal, BigInt(duration), fundingModel],
    account,
  })
}

// ERC-20 minimal ABI for approve
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs:  [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

export async function approveToken(
  tokenAddress: `0x${string}`,
  amount:       bigint,
): Promise<`0x${string}`> {
  const wallet    = getWalletClient()
  const [account] = await wallet.getAddresses()
  return wallet.writeContract({
    address: tokenAddress,
    abi:     ERC20_ABI,
    functionName: "approve",
    args:    [FUNDX_CONTRACT, amount],
    account,
  })
}

export async function donate(
  id:     number,
  amount: bigint,
): Promise<`0x${string}`> {
  const wallet    = getWalletClient()
  const [account] = await wallet.getAddresses()
  return wallet.writeContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "donate",
    args:    [BigInt(id), amount],
    account,
  })
}

export async function withdraw(id: number): Promise<`0x${string}`> {
  const wallet    = getWalletClient()
  const [account] = await wallet.getAddresses()
  return wallet.writeContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "withdraw",
    args:    [BigInt(id)],
    account,
  })
}

export async function claimRefund(id: number): Promise<`0x${string}`> {
  const wallet    = getWalletClient()
  const [account] = await wallet.getAddresses()
  return wallet.writeContract({
    address: FUNDX_CONTRACT,
    abi:     FUNDX_ABI,
    functionName: "claimRefund",
    args:    [BigInt(id)],
    account,
  })
}
```

- [ ] contract.ts created

---

## Phase 7 Checkpoint

```
[ ] wagmi.ts configured for Celo / Alfajores
[ ] Providers.tsx wrapping WagmiProvider and QueryClientProvider
[ ] layout.tsx wrapping children in Providers
[ ] contract.ts with all read and write functions
[ ] npx tsc --noEmit shows no errors
```

---

---

# PHASE 8 — Frontend: MiniPay Integration

**Goal:** Detect MiniPay, adapt the UI per wallet type, and satisfy the Proof of Ship hook requirement.

---

## 8.1 — Create the wallet detection utility

Create `src/lib/wallet.ts`:

```typescript
export type WalletType = "minipay" | "metamask" | "valora" | "unknown" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined") return "none"
  if (!window.ethereum)              return "none"
  if (window.ethereum.isMiniPay)     return "minipay"
  if (window.ethereum.isMetaMask)    return "metamask"
  return "unknown"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
```

- [ ] wallet.ts created

---

## 8.2 — Create the wallet hook

Create `src/hooks/useWallet.ts`:

```typescript
"use client"

import { useEffect, useState }  from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected }             from "wagmi/connectors"
import { detectWallet, isMiniPay, WalletType } from "@/lib/wallet"
import { TOKENS }               from "@/lib/tokens"

export function useWallet() {
  const { address, isConnected }  = useAccount()
  const { connect }               = useConnect()
  const { disconnect }            = useDisconnect()
  const [walletType, setWalletType] = useState<WalletType>("none")

  useEffect(() => {
    setWalletType(detectWallet())
  }, [])

  // MiniPay auto-connects — no button needed
  useEffect(() => {
    if (walletType === "minipay" && !isConnected) {
      connect({ connector: injected() })
    }
  }, [walletType, isConnected, connect])

  const defaultToken = TOKENS.cUSD  // Both wallet types default to cUSD

  return {
    address,
    isConnected,
    walletType,
    isMiniPay:   walletType === "minipay",
    defaultToken,
    connect:     () => connect({ connector: injected() }),
    disconnect,
  }
}
```

- [ ] useWallet.ts created

---

## 8.3 — Create the WalletConnect component

Create `src/components/wallet/WalletConnect.tsx`:

```tsx
"use client"

import { useWallet } from "@/hooks/useWallet"
import { Button }    from "@/components/ui/button"

export function WalletConnect() {
  const { address, isConnected, isMiniPay, connect, disconnect } = useWallet()

  // MiniPay auto-connects — no button needed
  if (isMiniPay) return null

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} size="sm">
      Connect Wallet
    </Button>
  )
}
```

- [ ] WalletConnect.tsx created

---

## 8.4 — Add the window.ethereum type declaration

MiniPay adds `isMiniPay` to `window.ethereum`. TypeScript does not know this by default. Fix it.

Create `src/types/global.d.ts`:

```typescript
interface Window {
  ethereum?: {
    isMetaMask?:  boolean
    isMiniPay?:   boolean
    request:      (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on:           (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  }
}
```

- [ ] global.d.ts created

---

## Phase 8 Checkpoint

```
[ ] wallet.ts with detectWallet and isMiniPay
[ ] useWallet.ts with auto-connect for MiniPay
[ ] WalletConnect.tsx that hides itself on MiniPay
[ ] global.d.ts with window.ethereum types
[ ] npx tsc --noEmit still clean
```

---

---

# PHASE 9 — Frontend: Campaign Creation Wizard

**Goal:** Update the existing 6-step create wizard to use cUSD/USDC instead of USDCx/STX.

---

## 9.1 — Update the data.ts file

Open your existing `src/data/data.ts` (or wherever it lives). Make these changes:

1. Change the currency type:
```typescript
// Before
currency: "USDCx" | "STX"

// After
currency: "cUSD" | "USDC"
```

2. Update every campaign entry:
```typescript
// Before
currency: "USDCx"
// After
currency: "cUSD"

// Before
currency: "STX"
// After
currency: "USDC"
```

3. Update the Campaign interface to add the token address field:
```typescript
token_address?: string  // actual contract token address
```

- [ ] data.ts updated

---

## 9.2 — Update the create page form data type

In your create page, update `CreateCampaignData`:

```typescript
// Replace
currency: "USDCx" | "STX"

// With
token: "cUSD" | "USDC"
```

- [ ] CreateCampaignData type updated

---

## 9.3 — Update Step 6 of the wizard (Funding Goals)

In your `WizardSteps.tsx`, find the step 6 token selector and replace it:

```tsx
// At the top of the component, import what you need
import { useWallet }  from "@/hooks/useWallet"
import { TOKENS }     from "@/lib/tokens"

// Inside Step 6
const { isMiniPay } = useWallet()

// Replace the old USDCx/STX selector with:
<div className="space-y-2 mb-6">
  <Label>Funding Asset</Label>

  {isMiniPay ? (
    // MiniPay users see cUSD locked in — no selector
    <div className="h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center px-4">
      <span className="font-bold text-emerald-700">cUSD</span>
      <span className="text-emerald-600 text-sm ml-2">— MiniPay native currency</span>
    </div>
  ) : (
    <Select
      onValueChange={(val) => setFormData({ ...formData, token: val as "cUSD" | "USDC" })}
      defaultValue={formData.token}
    >
      <SelectTrigger className="h-14 rounded-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="cUSD">
          <span className="font-bold text-emerald-600">cUSD</span>
          <span className="text-slate-500 ml-2 text-sm">— Celo Dollar (MiniPay native)</span>
        </SelectItem>
        <SelectItem value="USDC">
          <span className="font-bold text-blue-600">USDC</span>
          <span className="text-slate-500 ml-2 text-sm">— USD Coin</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )}
</div>
```

Also update the campaign info box at the bottom of Step 6:

```tsx
<div className={`p-6 rounded-xl border flex gap-4 items-start mt-6 
  ${formData.token === "cUSD" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}
>
  <div>
    <h4 className={`font-bold ${formData.token === "cUSD" ? "text-emerald-900" : "text-blue-900"}`}>
      Raising in {formData.token}
    </h4>
    <p className={`text-sm mt-1 ${formData.token === "cUSD" ? "text-emerald-700/80" : "text-blue-700/80"}`}>
      {formData.token === "cUSD"
        ? "cUSD is the native currency of MiniPay. Backers can donate directly from their MiniPay wallet with no extra steps."
        : "USDC is widely recognized and preferred by web-based and institutional backers."}
    </p>
  </div>
</div>
```

- [ ] Step 6 wizard updated for cUSD/USDC

---

## 9.4 — Wire the create form to the contract

In your create page's submit handler, replace any mock logic with a real contract call:

```typescript
import { createCampaign }   from "@/lib/contract"
import { parseTokenAmount }  from "@/lib/tokens"
import { daysToSeconds }     from "@/lib/time"
import { TOKENS }            from "@/lib/tokens"
import { parseContractError } from "@/lib/errors"

async function handleSubmit() {
  try {
    setLoading(true)

    const token       = TOKENS[formData.token as "cUSD" | "USDC"]
    const goalAtomic  = parseTokenAmount(formData.goal, token.decimals)
    const durationSec = daysToSeconds(Number(formData.duration))
    const model       = Number(formData.fundingModel) as 0 | 1

    const txHash = await createCampaign(token.address, goalAtomic, durationSec, model)

    // Wait for transaction, then redirect to campaign page
    // (In production, you would poll for the CampaignCreated event to get the ID)
    router.push(`/campaigns`)

  } catch (err) {
    setError(parseContractError(err))
  } finally {
    setLoading(false)
  }
}
```

- [ ] Create form wired to contract

---

## Phase 9 Checkpoint

```
[ ] data.ts updated from USDCx/STX to cUSD/USDC
[ ] CreateCampaignData type updated
[ ] Step 6 shows cUSD/USDC selector (or locked cUSD on MiniPay)
[ ] Submit handler calls the contract
```

---

---

# PHASE 10 — Frontend: Campaign Explore & Detail Pages

**Goal:** Display campaigns with correct token badges, funding model badges, and goal progress.

---

## 10.1 — Create the TokenBadge component

Create `src/components/campaign/TokenBadge.tsx`:

```tsx
import { TOKENS, TokenSymbol } from "@/lib/tokens"
import { getTokenByAddress }   from "@/lib/tokens"

interface Props {
  symbol?: TokenSymbol
  address?: string
}

export function TokenBadge({ symbol, address }: Props) {
  const token = symbol ? TOKENS[symbol] : (address ? getTokenByAddress(address) : null)
  if (!token) return null

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${token.color} ${token.bgColor}`}>
      {token.symbol}
    </span>
  )
}
```

- [ ] TokenBadge.tsx created

---

## 10.2 — Create the FundingModelBadge component

Create `src/components/campaign/FundingModelBadge.tsx`:

```tsx
interface Props {
  model: 0 | 1 | "Flexible Model" | "All-or-Nothing"
}

export function FundingModelBadge({ model }: Props) {
  const isFlexible = model === 0 || model === "Flexible Model"

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
      ${isFlexible
        ? "bg-violet-50 text-violet-700"
        : "bg-amber-50 text-amber-700"
      }`}
    >
      {isFlexible ? "Flexible" : "All-or-Nothing"}
    </span>
  )
}
```

- [ ] FundingModelBadge.tsx created

---

## 10.3 — Update CampaignCard to show token badge

In your existing `CampaignCard.tsx`, replace any `USDCx` or `STX` currency display with:

```tsx
import { TokenBadge }        from "./TokenBadge"
import { FundingModelBadge } from "./FundingModelBadge"

// Inside the card JSX, where you show currency:
<TokenBadge symbol={campaign.currency as "cUSD" | "USDC"} />
<FundingModelBadge model={campaign.fundingModel} />
```

- [ ] CampaignCard updated

---

## Phase 10 Checkpoint

```
[ ] TokenBadge shows correct color per token
[ ] FundingModelBadge shows Flexible / All-or-Nothing
[ ] Campaign cards display updated badges
[ ] No USDCx or STX references remain in UI text
```

---

---

# PHASE 11 — Frontend: Donate Flow

**Goal:** Build the donation flow with token approval + donation, adapted per wallet type.

---

## 11.1 — Create the useDonate hook

Create `src/hooks/useDonate.ts`:

```typescript
"use client"

import { useState }              from "react"
import { approveToken, donate }  from "@/lib/contract"
import { parseTokenAmount }      from "@/lib/tokens"
import { parseContractError }    from "@/lib/errors"

export function useDonate(campaignId: number, tokenAddress: `0x${string}`, decimals: number) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [txHash,  setTxHash]  = useState<string | null>(null)

  async function executeDonate(amountStr: string) {
    try {
      setLoading(true)
      setError(null)

      const amount = parseTokenAmount(amountStr, decimals)
      if (amount === 0n) { setError("Enter a valid amount"); return }

      // Step 1: Approve the contract to spend the token
      const approveTx = await approveToken(tokenAddress, amount)
      console.log("Approval tx:", approveTx)

      // Step 2: Donate
      const donateTx = await donate(campaignId, amount)
      console.log("Donation tx:", donateTx)

      setTxHash(donateTx)

    } catch (err) {
      setError(parseContractError(err))
    } finally {
      setLoading(false)
    }
  }

  return { executeDonate, loading, error, txHash }
}
```

- [ ] useDonate.ts created

---

## 11.2 — Disable donate button based on campaign state

In your DonateModal or donation form, add these guards before rendering the donate button:

```typescript
import { isPastDeadline } from "@/lib/time"

const deadlinePassed = isPastDeadline(campaign.deadline)
const isInactive     = !campaign.active
const isAllOrNothing = campaign.fundingModel === 1 || campaign.fundingModel === "All-or-Nothing"
const goalReached    = campaign.totalRaised >= campaign.goal

const canDonate = !deadlinePassed && !isInactive && !(isAllOrNothing && goalReached)

let disabledReason = ""
if (!isConnected)                          disabledReason = "Connect Wallet"
else if (deadlinePassed)                   disabledReason = "Campaign Ended"
else if (isInactive)                       disabledReason = "Campaign Closed"
else if (isAllOrNothing && goalReached)    disabledReason = "Goal Reached"
```

- [ ] Donate button guards implemented

---

## Phase 11 Checkpoint

```
[ ] useDonate hook performs approve then donate
[ ] Button disabled with correct reason per state
[ ] Error messages from contract are human-readable
[ ] MiniPay users see the flow without token selector
```

---

---

# PHASE 12 — Frontend: Withdraw & Refund Flows

**Goal:** Build creator withdraw panel and backer refund panel with correct eligibility checks.

---

## 12.1 — Create useWithdraw hook

Create `src/hooks/useWithdraw.ts`:

```typescript
"use client"

import { useState }           from "react"
import { withdraw }           from "@/lib/contract"
import { parseContractError } from "@/lib/errors"

export function useWithdraw(campaignId: number) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [txHash,  setTxHash]  = useState<string | null>(null)

  async function executeWithdraw() {
    try {
      setLoading(true)
      setError(null)
      const tx = await withdraw(campaignId)
      setTxHash(tx)
    } catch (err) {
      setError(parseContractError(err))
    } finally {
      setLoading(false)
    }
  }

  return { executeWithdraw, loading, error, txHash }
}
```

- [ ] useWithdraw.ts created

---

## 12.2 — Create useRefund hook

Create `src/hooks/useRefund.ts`:

```typescript
"use client"

import { useState }           from "react"
import { claimRefund }        from "@/lib/contract"
import { parseContractError } from "@/lib/errors"

export function useRefund(campaignId: number) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [txHash,  setTxHash]  = useState<string | null>(null)

  async function executeRefund() {
    try {
      setLoading(true)
      setError(null)
      const tx = await claimRefund(campaignId)
      setTxHash(tx)
    } catch (err) {
      setError(parseContractError(err))
    } finally {
      setLoading(false)
    }
  }

  return { executeRefund, loading, error, txHash }
}
```

- [ ] useRefund.ts created

---

## 12.3 — Withdraw eligibility logic

In `WithdrawPanel.tsx`, compute eligibility before rendering:

```typescript
import { isPastDeadline } from "@/lib/time"
import { calculateFee, calculateNet } from "@/lib/fee"
import { formatTokenAmount } from "@/lib/tokens"

const isCreator      = address?.toLowerCase() === campaign.creator.toLowerCase()
const deadlinePassed = isPastDeadline(campaign.deadline)
const isFlexible     = campaign.fundingModel === 0
const goalMet        = campaign.totalRaised >= campaign.goal

const canWithdraw =
  isCreator &&
  deadlinePassed &&
  !campaign.withdrawn &&
  (isFlexible || goalMet)

let reason = ""
if (!isCreator)            reason = "Only the campaign creator can withdraw."
else if (!deadlinePassed)  reason = "Campaign has not ended yet."
else if (campaign.withdrawn) reason = "Already withdrawn."
else if (!isFlexible && !goalMet) reason = "Goal was not reached. Backers may claim refunds."
```

- [ ] WithdrawPanel eligibility logic added

---

## 12.4 — Refund eligibility logic

In `RefundPanel.tsx`:

```typescript
const isAllOrNothing = campaign.fundingModel === 1
const deadlinePassed = isPastDeadline(campaign.deadline)
const goalFailed     = campaign.totalRaised < campaign.goal

const showRefundPanel = isAllOrNothing

const canRefund =
  isAllOrNothing &&
  deadlinePassed &&
  goalFailed &&
  donationAmount > 0n

let reason = ""
if (!deadlinePassed)       reason = "Campaign has not ended yet."
else if (!goalFailed)      reason = "The goal was reached — no refunds available."
else if (!donationAmount)  reason = "No donation found for your address."
```

- [ ] RefundPanel eligibility logic added

---

## Phase 12 Checkpoint

```
[ ] useWithdraw and useRefund hooks created
[ ] Withdraw button shows correct eligibility state
[ ] Refund panel only shows for All-or-Nothing campaigns
[ ] Refund button guards match contract rules exactly
```

---

---

# PHASE 13 — Humanity Verification

**Goal:** Integrate Self Protocol for creator identity verification.

---

## 13.1 — Understand what you are integrating

Self Protocol lets users scan their passport with their phone. The app generates a ZK proof that verifies the person is real and over 18 without revealing any personal data. An on-chain attestation is written to their wallet address.

Your FundX frontend reads this attestation and displays a verification badge.

---

## 13.2 — Go to Self Protocol docs

Navigate to: https://docs.self.xyz

Follow their integration guide for Next.js. The steps will vary based on their current SDK version but the general flow is:

1. Install their SDK: `npm install @selfxyz/client`
2. Create a verification request in your create campaign flow
3. The user completes verification in the Self app on their phone
4. Read the attestation status from their on-chain record
5. Display the badge

- [ ] Self Protocol docs reviewed

---

## 13.3 — Add the verification badge to campaign cards

Once integrated, add this to `CampaignCard.tsx` and the campaign detail page:

```tsx
{campaign.creatorVerified && (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
    ✓ Verified Creator
  </span>
)}
```

- [ ] Verification badge added to UI

---

## Phase 13 Checkpoint

```
[ ] Self Protocol SDK installed
[ ] Verification flow accessible from create campaign or profile
[ ] Verified badge shows on campaign cards
```

---

---

# PHASE 14 — Deploy to Celo Mainnet

**Goal:** Deploy the contract to Celo mainnet and switch the frontend to mainnet.

---

## 14.1 — Final contract review checklist

Before deploying to mainnet, confirm every item:

```
[ ] All tests pass: forge test -vvv shows 0 failures
[ ] cUSD mainnet address is 0x765DE816845861e75A25fCA122bb6898B8B1282a
[ ] USDC mainnet address is 0xcebA9300f2b948710d2653dD7B07f33A8B32118C
[ ] Deploy script uses the correct mainnet addresses
[ ] Your deployer wallet has real CELO for gas
[ ] You have tested every flow on Alfajores testnet first
[ ] You accept that mainnet deployment is permanent
```

---

## 14.2 — Deploy to mainnet

```bash
cd contracts
source .env

forge script script/Deploy.s.sol \
  --rpc-url $CELO_RPC \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://celoscan.io/api \
  -vvv
```

**Copy the contract address from the output.**

- [ ] Contract deployed to Celo mainnet
- [ ] Mainnet contract address saved

---

## 14.3 — Verify on Celoscan

Go to: `https://celoscan.io/address/0xYourMainnetContractAddress`

You should see the verified source code.

- [ ] Contract verified on mainnet Celoscan

---

## 14.4 — Switch frontend to mainnet

Update `frontend/.env.local`:

```
NEXT_PUBLIC_FUNDX_CONTRACT=0xYourMainnetContractAddress
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
```

Restart the dev server:

```bash
npm run dev
```

Test the full flow on mainnet with a small amount of real cUSD.

- [ ] Frontend pointing to mainnet contract
- [ ] Full flow tested on mainnet

---

## 14.5 — Build and deploy the frontend

**Option A — Vercel (recommended):**

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will detect Next.js automatically.

After deploying, go to your Vercel dashboard, find the project, go to Settings → Environment Variables, and add the three variables from `.env.local`.

Redeploy.

**Option B — Netlify:**

```bash
npm run build
# Upload the .next folder to Netlify
```

- [ ] Frontend deployed to production

---

## Phase 14 Checkpoint

```
[ ] Contract on Celo mainnet
[ ] Contract verified on Celoscan
[ ] Frontend on mainnet configuration
[ ] Frontend deployed to production URL
[ ] Full flow working end-to-end on mainnet
```

---

---

# PHASE 15 — Proof of Ship Submission

**Goal:** Submit FundX to the Proof of Ship campaign with all requirements satisfied.

---

## 15.1 — Verify each requirement is met

Go through each requirement and confirm:

```
[ ] BUILD FOR MINIPAY
    - isMiniPay detection in wallet.ts: DONE
    - MiniPay auto-connects without button: DONE
    - cUSD defaults for MiniPay users: DONE
    - Mobile-optimized donation flow: DONE

[ ] DEPLOY ON CELO
    - Smart contract on Celo mainnet: DONE
    - Contract address: 0x______________

[ ] PROVE YOUR HUMANITY
    - Self Protocol / Worldcoin / Coinbase verification: DONE
    - Verification badge visible on campaigns: DONE

[ ] SUBMIT YOUR PROJECT
    - Production URL ready: _______________
    - GitHub repository public: _______________
    - Contract address documented: _______________
```

---

## 15.2 — Prepare your submission materials

Things you will likely need to submit:

1. **Project name:** FundX
2. **One-line description:** Programmable stablecoin crowdfunding escrow on Celo, built for MiniPay users.
3. **Production URL:** Your Vercel/Netlify link
4. **GitHub repository:** Your public repo link
5. **Contract address:** Your mainnet contract address on Celoscan
6. **MiniPay hook description:** Automatic wallet detection and cUSD default for MiniPay users via `window.ethereum.isMiniPay`
7. **Humanity verification method:** Self Protocol / Worldcoin / Coinbase

---

## 15.3 — Submit

Go to the Proof of Ship submission page and fill in all fields.

- [ ] Submission complete

---

---

# APPENDIX — Common Errors & Fixes

---

## Foundry Errors

**`Error: could not find file for import`**

Your `foundry.toml` remappings are wrong or missing. Make sure this line is in `[profile.default]`:
```toml
remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]
```

**`Error: Unknown version`**

Add a compiler version to `foundry.toml`:
```toml
solc_version = "0.8.20"
```

**`Error: insufficient funds`**

Your deployer wallet does not have enough CELO for gas. Get testnet CELO from https://faucet.celo.org.

---

## Frontend Errors

**`Cannot read properties of undefined (reading 'isMiniPay')`**

You are reading `window.ethereum` before the page has loaded. Use a `useEffect` hook or check `typeof window !== "undefined"` first.

**`WagmiProvider not found`**

Your component is not wrapped in the Providers. Check `layout.tsx` imports `Providers` and wraps `{children}`.

**`Transaction reverted`**

Run the function through `parseContractError` from `errors.ts`. Read the revert reason. Match it to the contract logic.

**`User rejected the request`**

The user cancelled the wallet popup. This is not an error — just show a soft message.

---

## Token Errors

**`TransferFailed` on donate**

The donor did not approve the contract to spend their tokens, or approved less than the donation amount. The approve step must happen before donate.

**Wrong decimal amount displayed**

Check which token is being used. cUSD has 18 decimals. USDC has 6. Always use `formatTokenAmount(amount, token.decimals)`, not a hardcoded value.

---

## Network Errors

**Wrong network in MetaMask**

The user is not on Celo. Your wagmi config should handle this and prompt them to switch. You can add this to your `WalletConnect` component:

```typescript
import { useSwitchChain } from "wagmi"
const { switchChain } = useSwitchChain()
// Then: switchChain({ chainId: 44787 }) for Alfajores
```

---

# FINAL CHECKLIST — Everything Before You Ship

```
CONTRACTS
[ ] forge test -vvv → 0 failures
[ ] forge build → no errors
[ ] Deployed to Alfajores → tested
[ ] Deployed to Celo mainnet → address saved
[ ] Verified on Celoscan

FRONTEND
[ ] No USDCx or STX references anywhere in the UI
[ ] cUSD and USDC token badges working
[ ] MiniPay detection working
[ ] MiniPay auto-connects without button
[ ] Token defaults to cUSD on MiniPay
[ ] Donate flow: approve + donate both working
[ ] Withdraw flow: eligibility checks correct
[ ] Refund flow: only shows for All-or-Nothing failed campaigns
[ ] All error messages are human-readable
[ ] .env.local points to mainnet contract
[ ] Frontend deployed to production

PROOF OF SHIP
[ ] MiniPay hook documented
[ ] Celo mainnet deployment documented
[ ] Humanity verification integrated
[ ] Submission form filled and submitted
```

---

*Built with Celo. Powered by cUSD and USDC. Made for MiniPay.*
