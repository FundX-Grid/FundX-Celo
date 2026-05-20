# FundX-Celo — Integration Progress

> Reference document for the FundX-Celo contract integration effort.
> Changes validated here are the source pattern for porting to FundX (Stacks) and FundX-Stellar.

---

## Reference

| Item | Value |
|---|---|
| Network | Celo Mainnet |
| FundX Escrow | `0x4e10d988765EA22aAD4E52353f183EbD54D3ea8C` |
| cUSD | `0x765DE816845861e75A25fCA122bb6898B8B1282a` (18 dec) |
| USDC | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` (6 dec) |
| Platform fee | 200 bps (2%), enforced in contract |
| RPC | `https://forno.celo.org` |

---

## Tasks

| # | Task | Status |
|---|---|---|
| 1 | Wire Explore page to live contract data | ✅ done |
| 2 | Wire Campaign Detail to live contract (all flows) | ✅ done |
| 3 | Wire Dashboard CreatorTab to live contract | ✅ done |
| 4 | Wire Dashboard BackerTab to live contract | ✅ done |
| 5 | Port data wiring to FundX (Stacks) | ✅ done |
| 6 | Build FundX Soroban contract (Stellar) | ✅ done |
| 7 | Port FundX-Stellar frontend | ✅ done |

Build status after each completed task: `npx next build` — exit 0, all 6 routes compile.

---

## Completed work

### Task 1 — Explore page → live contract data

**Files:**
- `src/lib/hooks/useContract.ts` — new `useAllCampaigns` hook (calls `campaignCount_`, then batches `getCampaign(i)` for `i ∈ [0, count)` via `useReadContracts`). Adds `OnChainCampaign` type and `mapContractCampaign` helper that converts the raw contract tuple to a display-friendly shape (formatUnits with correct decimals, derived `status`, `daysLeft`, cycled placeholder image, etc.).
- `src/app/explore/page.tsx` — uses `useAllCampaigns`. Loading skeleton (3 cards). Merges live campaigns first, then pads with `CAMPAIGNS` from `data.ts` so the page is never empty for visitors. Mock IDs are string slugs; live IDs are numeric strings — no collision. Badge reports `N Campaigns · M on-chain`.
- `src/app/layout.tsx` — fixed pre-existing `from_` import corruption that was blocking builds.

**Status derivation (from contract fields only):**
- `!isPast` → `active`
- `isPast && (isFlexible || raised >= goal)` → `successful`
- `isPast && !isFlexible && raised < goal` → `failed`

### Task 2 — Campaign Detail → full contract integration

**File:** `src/app/campaigns/[id]/page.tsx` — full rewrite.

**Numeric IDs (on-chain campaigns):**
- Reads `getCampaign(id)`. 404 if creator is the zero address.
- **Donate flow** — approve ERC20 → call `donate(id, amount)` → awaits receipt → `refetch()`. Disabled if past deadline, deactivated, or (AON only) goal already met.
- **Withdraw flow** — creator-only. Shown when `isPast && !withdrawn && (isFlexible || goalReached)`. Disabled at `raised === 0`.
- **Refund flow** — backer-only. Shown when `!isFlexible && isPast && !goalReached && userDonation > 0`. Pulls user's stake via `useDonation(id, address)`.
- Status badge: Active / Funded / Failed.
- Sticky sidebar shows the right CTA based on `isCreator` + status.
- `txPending` blocks all three handlers from interleaving.
- MiniPay `feeCurrency` defaulted to cUSD on MiniPay, otherwise the campaign token.

**Slug IDs (mock campaigns from `data.ts`):**
- Short-circuit branch at the top — renders a Demo Campaign view with disabled "Demo — Not Live" CTA, orange demo badge, and a note explaining real deployment unlocks donations.
- Keeps mock links from explore page working without polluting the main contract render path.

### Task 3 — Dashboard CreatorTab → live contract

**File:** `src/components/dashboard/CreatorTab.tsx` — full rewrite.

- Uses `useAllCampaigns`, filters where `creator.toLowerCase() === address.toLowerCase()`.
- All mock data removed.
- Fixed off-by-one ID indexing (previous code iterated `i = 1` to `count`; contract IDs are 0-indexed).
- Withdraw handler awaits the receipt and calls `refetch()` on success.
- Per-campaign `withdrawingId` state — no global lock, so multiple campaigns can be displayed without blocking each other.
- Empty state with `/create` CTA.
- Three card variants kept (Active / Successful / Failed) with original visual design.

### Task 4 — Dashboard BackerTab → live contract

**File:** `src/components/dashboard/BackerTab.tsx` — full rewrite.

- Uses `useAllCampaigns` for campaign data.
- Separate batched `useReadContracts` for `getDonation(i, address)` across all campaign IDs.
- Filters to only campaigns where the user's donation `> 0`.
- All mock data removed.
- Status logic:
  - `!isPast` → `active`
  - `isPast && (isFlexible || goalReached)` → `successful`
  - `isPast && !isFlexible && !goalReached` → `refund_available`
- `RefundCard` awaits the receipt and calls `onSuccess()` (refetch).
- Three sub-components: `RefundCard`, `ActiveCard`, `SuccessCard`.
- Empty state with `/explore` CTA.

---

## Polish & fixes (during integration)

| File | Fix |
|---|---|
| `src/app/layout.tsx` | `from_` → `from` (×4) — pre-existing build blocker |
| `src/components/fundx/hero/HeroBadge.tsx` | `inline_-flex` / `rounded_-full` → valid Tailwind — restored circular green ping |
| `src/components/fundx/hero/HeroHeadline.tsx` | `font_-bold` / `font_-extrabold` → valid Tailwind — restored headline weight |
| `src/components/fundx/hero/ChainToggleIcon.tsx` | `rotate_(Xdeg)` → `rotate(Xdeg)` — restored chain toggle tilt CSS transform |
| `src/components/fundx/CampaignFan.tsx` | `setTimeout(200)` → `useLayoutEffect` + synchronous `measure()` — eliminates first-paint card jump |

The `_-` / `_` corruption pattern looked systematic. Swept the rest of `src/` with grep — no remaining bad class names (the few hits were valid Tailwind `hover:-translate-y-1` or variable names like `frameRef_`).

---

## Known limitations & open questions

1. **No on-chain metadata.** The Solidity contract stores `creator`, `token`, `goal`, `deadline`, `totalRaised`, `withdrawn`, `active`, `fundingModel` — nothing else. Title, description, image, category, creator profile all live off-chain. Live campaigns currently render as "Campaign #N" with cycled placeholder images. **Next step candidates:** IPFS pointer in `createCampaign`, an indexed metadata event, or a backend keyed by campaign ID.

2. **Backer count is not tracked.** The contract has no `backerCount` field and we're not parsing `DonationReceived` events yet. UI currently omits backer count for on-chain campaigns. Could be derived from event logs via `getLogs` if needed.

3. **No event indexing.** All reads are direct contract calls (`getCampaign`, `getDonation`) — scales poorly for many campaigns. Eventually move to a subgraph / Ponder / Envio indexer.

4. **`isMiniPay()` is called inline in components.** Detection runs `typeof window !== "undefined"` guarded but happens on every render. Fine for now; could be hoisted to a context provider.

---

## Cross-chain port plan (anticipated mappings — to verify when porting)

| Behavior | Celo (validated) | Stacks (to verify against `FundX.clar`) | Stellar (to design in Soroban) |
|---|---|---|---|
| Read all campaigns | `campaignCount_` + batched `getCampaign(i)` | `get-campaign-count` + per-ID `get-campaign` (Clarity has no batching primitive — sequential or use a mempool RPC batcher) | `campaign_count` + batched invokes via `rpc.simulateTransaction` |
| Campaign status | `block.timestamp` vs `deadline` + `fundingModel` + `totalRaised` | `burn-block-height` or `stacks-block-height` deadline — confirm which `FundX.clar` uses | Ledger close time vs `deadline` |
| Donate | `approve` ERC20 → `donate(id, amount)` | `ft-transfer?` to escrow → `donate` map update (Clarity allows atomic) | SAC `transfer` → `donate` invoke |
| Withdraw | `withdraw(id)` — creator + past deadline + (flexible \|\| goalReached) | `withdraw` Clarity public fn — same guards | `withdraw` Soroban fn |
| Refund | `claimRefund(id)` — AON + past + !goalReached + donation>0 | `claim-refund` Clarity public fn | `claim_refund` Soroban fn |
| Fee-token UX | `feeCurrency: cUSD` for MiniPay calls | N/A | N/A |
| Address type | `0x...` (20 bytes) | `SP...` / `ST...` (Stacks principal) | `G...` (Stellar account / contract) |
| Decimals | cUSD 18 / USDC 6 | USDCx — verify in SIP-010 metadata | XLM 7, USDC 7 |

---

## How to resume

1. `cd ~/Projects/FundX-Celo && npm run dev` — verify all four wired surfaces (`/`, `/explore`, `/campaigns/0`, `/dashboard`) load against mainnet.
2. To start Task 5: copy `useAllCampaigns` pattern into `FundX/src/lib/` adapting reads to `@stacks/transactions` `callReadOnlyFunction`. Mock fallback strategy and merged display array transfer 1:1.
3. To start Task 6: contract is `~/Projects/FundX-Stellar/packages/contracts/src/lib.rs` (currently 12 lines). Mirror `FundXEscrow.sol` semantics in Soroban — use `Address` for accounts, `Map<u32, Campaign>` for storage, `env.ledger().timestamp()` for deadline checks.
