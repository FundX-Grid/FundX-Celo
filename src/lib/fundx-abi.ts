export const generateAbiDefinition = (name: string, type: string, stateMutability: string, inputs: any[], outputs: any[]) => ({ name, type, stateMutability, inputs, outputs });

export const FUNDX_ABI = [
  // createCampaign
  generateAbiDefinition(
    "createCampaign",
    "function",
    "nonpayable",
    [
      { name: "token", type: "address" },
      { name: "goal", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "fundingModel", type: "uint8" },
    ],
    [{ name: "id", type: "uint256" }],
  ),
  // donate
  generateAbiDefinition(
    "donate",
    "function",
    "nonpayable",
    [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    [],
  ),
  // withdraw
  generateAbiDefinition(
    "withdraw",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    [],
  ),
  // claimRefund
  generateAbiDefinition(
    "claimRefund",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    [],
  ),
  // deactivateCampaign
  generateAbiDefinition(
    "deactivateCampaign",
    "function",
    "nonpayable",
    [{ name: "id", type: "uint256" }],
    [],
  ),
  // setAllowedToken
  generateAbiDefinition(
    "setAllowedToken",
    "function",
    "nonpayable",
    [
      { name: "token", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    [],
  ),
  // getCampaign
  generateAbiDefinition(
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
    ],
  ),
  // getDonation
  generateAbiDefinition(
    "getDonation",
    "function",
    "view",
    [
      { name: "campaignId", type: "uint256" },
      { name: "donor", type: "address" },
    ],
    [{ name: "", type: "uint256" }],
  ),
  // campaignCount_
  generateAbiDefinition(
    "campaignCount_",
    "function",
    "view",
    [],
    [{ name: "", type: "uint256" }],
  ),
  // calculateFee
  generateAbiDefinition(
    "calculateFee",
    "function",
    "pure",
    [{ name: "amount", type: "uint256" }],
    [{ name: "", type: "uint256" }],
  ),
  // calculateNet
  generateAbiDefinition(
    "calculateNet",
    "function",
    "pure",
    [{ name: "amount", type: "uint256" }],
    [{ name: "", type: "uint256" }],
  ),
  // isPastDeadline
  generateAbiDefinition(
    "isPastDeadline",
    "function",
    "view",
    [{ name: "id", type: "uint256" }],
    [{ name: "", type: "bool" }],
  ),
  // isGoalReached
  generateAbiDefinition(
    "isGoalReached",
    "function",
    "view",
    [{ name: "id", type: "uint256" }],
    [{ name: "", type: "bool" }],
  ),
  // allowedTokens
  generateAbiDefinition(
    "allowedTokens",
    "function",
    "view",
    [{ name: "", type: "address" }],
    [{ name: "", type: "bool" }],
  ),
  // owner
  generateAbiDefinition(
    "owner",
    "function",
    "view",
    [],
    [{ name: "", type: "address" }],
  ),
  // Events
  generateAbiDefinition(
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
    [],
  ),
  generateAbiDefinition(
    "DonationReceived",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
    [],
  ),
  generateAbiDefinition(
    "FundsWithdrawn",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "net", type: "uint256", indexed: false },
      { name: "fee", type: "uint256", indexed: false },
    ],
    [],
  ),
  generateAbiDefinition(
    "RefundClaimed",
    "event",
    "",
    [
      { name: "campaignId", type: "uint256", indexed: true },
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
    [],
  ),
  generateAbiDefinition(
    "CampaignDeactivated",
    "event",
    "",
    [{ name: "campaignId", type: "uint256", indexed: true }],
    [],
  ),
] as const;
