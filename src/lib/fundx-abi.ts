export const FUNDX_ABI = [
  // createCampaign
  {
    name: "createCampaign",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "goal", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "fundingModel", type: "uint8" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  // donate
  {
    name: "donate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  // withdraw
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  // claimRefund
  {
    name: "claimRefund",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  // deactivateCampaign
  {
    name: "deactivateCampaign",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  // setAllowedToken
  {
    name: "setAllowedToken",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    outputs: [],
  },
  // getCampaign
  {
    name: "getCampaign",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "creator", type: "address" },
          { name: "token", type: "address" },
          { name: "goal", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "totalRaised", type: "uint256" },
          { name: "withdrawn", type: "bool" },
          { name: "active", type: "bool" },
          { name: "fundingModel", type: "uint8" },
        ],
      },
    ],
  },
  // getDonation
  {
    name: "getDonation",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "campaignId", type: "uint256" },
      { name: "donor", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // campaignCount_
  {
    name: "campaignCount_",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // calculateFee
  {
    name: "calculateFee",
    type: "function",
    stateMutability: "pure",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // calculateNet
  {
    name: "calculateNet",
    type: "function",
    stateMutability: "pure",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // isPastDeadline
  {
    name: "isPastDeadline",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  // isGoalReached
  {
    name: "isGoalReached",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  // allowedTokens
  {
    name: "allowedTokens",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  // owner
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  // Events
  {
    name: "CampaignCreated",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "token", type: "address", indexed: false },
      { name: "goal", type: "uint256", indexed: false },
      { name: "deadline", type: "uint256", indexed: false },
      { name: "fundingModel", type: "uint8", indexed: false },
    ],
  },
  {
    name: "DonationReceived",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "FundsWithdrawn",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "net", type: "uint256", indexed: false },
      { name: "fee", type: "uint256", indexed: false },
    ],
  },
  {
    name: "RefundClaimed",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CampaignDeactivated",
    type: "event",
    inputs: [
      { name: "campaignId", type: "uint256", indexed: true },
    ],
  },
] as const


// ⟳ echo · src/components/fundx/ConnectWallet.tsx
//             <div className="mx-1 px-3 py-2 mb-2 bg-slate-50 rounded-lg border border-slate-100">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-xs font-bold text-slate-700">Celo Mainnet</span>
//               </div>
//               <p className="text-[10px] text-slate-400 font-mono break-all leading-tight">