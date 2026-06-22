export const generateAbiObject = (name: string, type: string, stateMutability: string, inputs: any[], outputs: any[]) => ({ name, type, stateMutability, inputs, outputs });

export const FUNDX_ABI = [
  // createCampaign
  generateAbiObject(
    "createCampaign",
    "function",
    "nonpayable",
    [
      { name: "token", type: "address" },
      { name: "goal", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "fundingModel", type: "uint8" },
    ],
    [{ name: "id", type: "uint256" }]
  ),
  // donate
  generateAbiObject(
    "donate",
    "function",
    "nonpayable",
    [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    []
  ),
  // withdraw
  generateAbiObject(
    "withdraw",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    []
  ),
  // claimRefund
  generateAbiObject(
    "claimRefund",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    []
  ),
  // deactivateCampaign
  generateAbiObject(
    "deactivateCampaign",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    []
  ),
  // setAllowedToken
  generateAbiObject(
    "setAllowedToken",
    "function",
    "nonpayable",
    [
      { name: "token", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    []
  ),
  // getCampaign
  generateAbiObject(
    "getCampaign",
    "function",
    "view",
    [{ name: "id", type: "uint256" }],
    [
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
    ]
  ),
  // getDonation
  generateAbiObject(
    "getDonation",
    "function",
    "view",
    [
      { name: "campaignId", type: "uint256" },
      { name: "donor", type: "address" },
    ],
    [{ name: "", type: "uint256" }]
  ),
  // campaignCount_
  generateAbiObject(
    "campaignCount_",
    "function",
    "view",
    [],
    [{ name: "", type: "uint256" }]
  ),
  // calculateFee
  generateAbiObject(
    "calculateFee",
    "function",
    "pure",
    [{ name: "amount", type: "uint256" }],
    [{ name: "", type: "uint256" }]
  ),
  // calculateNet
  generateAbiObject(
    "calculateNet",
    "function",
    "pure",
    [{ name: "amount", type: "uint256" }],
    [{ name: "", type: "uint256" }]
  ),
  // isPastDeadline
  generateAbiObject(
    "isPastDeadline",
    "function",
    "view",
    [{ name: "id", type: "uint256" }],
    [{ name: "", type: "bool" }]
  ),
  // isGoalReached
  generateAbiObject(
    "isGoalReached",
    "function",
    "view",
    [{ name: "id", type: "uint256" }],
    [{ name: "", type: "bool" }]
  ),
  // allowedTokens
  generateAbiObject(
    "allowedTokens",
    "function",
    "view",
    [{ name: "", type: "address" }],
    [{ name: "", type: "bool" }]
  ),
  // owner
  generateAbiObject(
    "owner",
    "function",
    "view",
    [],
    [{ name: "", type: "address" }]
  ),
  // Events
  generateAbiObject(
    "CampaignCreated",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "token", type: "address", indexed: false },
      { name: "goal", type: "uint256", indexed: false },
      { name: "deadline", type: "uint256", indexed: false },
      { name: "fundingModel", type: "uint8", indexed: false },
    ],
    []
  ),
  generateAbiObject(
    "DonationReceived",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
    []
  ),
  generateAbiObject(
    "FundsWithdrawn",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "net", type: "uint256", indexed: false },
      { name: "fee", type: "uint256", indexed: false },
    ],
    []
  ),
  generateAbiObject(
    "RefundClaimed",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
    []
  ),
  generateAbiObject(
    "CampaignDeactivated",
    "event",
    "",
    [{ name: "campaignId", type: "uint256", indexed: true }],
    []
  ),
] as const;
