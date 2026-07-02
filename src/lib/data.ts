export type CampaignStatus = "active" | "successful" | "failed"; 
export type FundingModel = "Flexible Model" | "All-or-Nothing"; 
export type TokenSymbol = "cUSD" | "USDC"; 

export interface Campaign { 
  id: string; 
  title: string; 
  tagline: string; 
  description: string; 
  category: string; 
  projectStage: string; 
  location: string; 
  raised: number; 
  goal: number; 
  currency: TokenSymbol; 
  token_address: string; 
  image: string; 
  creator: string; 
  creatorImage: string; 
  creatorBio: string; 
  twitter: string; 
  github: string; 
  portfolio: string; 
  videoUrl: string; 
  budgetBreakdown: string; 
  roadmap: string; 
  daysLeft: number; 
  backers: number; 
  isTrending?: boolean; 
  status: CampaignStatus; 
  fundingModel: FundingModel; 
} 

// Celo token addresses 
export const TOKEN_ADDRESSES = { 
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a", 
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", 
}; 

function createCampaign({ 
  id, 
  title, 
  tagline, 
  description, 
  category, 
  projectStage, 
  location, 
  raised, 
  goal, 
  currency, 
  tokenAddress, 
  image, 
  creator, 
  creatorImage, 
  creatorBio, 
  twitter, 
  github, 
  portfolio, 
  videoUrl, 
  budgetBreakdown, 
  roadmap, 
  daysLeft, 
  backers, 
  isTrending = false, 
  status, 
  fundingModel 
}: { 
  id: string; 
  title: string; 
  tagline: string; 
  description: string; 
  category: string; 
  projectStage: string; 
  location: string; 
  raised: number; 
  goal: number; 
  currency: TokenSymbol; 
  tokenAddress: string; 
  image: string; 
  creator: string; 
  creatorImage: string; 
  creatorBio: string; 
  twitter: string; 
  github: string; 
  portfolio: string; 
  videoUrl: string; 
  budgetBreakdown: string; 
  roadmap: string; 
  daysLeft: number; 
  backers: number; 
  isTrending?: boolean; 
  status: CampaignStatus; 
  fundingModel: FundingModel 
}) { 
  return { 
    id, 
    title, 
    tagline, 
    description, 
    category, 
    projectStage, 
    location, 
    raised, 
    goal, 
    currency, 
    token_address: tokenAddress, 
    image, 
    creator, 
    creatorImage, 
    creatorBio, 
    twitter, 
    github, 
    portfolio, 
    videoUrl, 
    budgetBreakdown, 
    roadmap, 
    daysLeft, 
    backers, 
    isTrending, 
    status, 
    fundingModel 
  }; 
} 

export const CAMPAIGNS: Campaign[] = [ 
  // --- ACTIVE CAMPAIGNS --- 
  createCampaign({ 
    id: "celo-school", 
    title: "Celo School", 
    tagline: "Teaching Solidity and Celo development to 10,000 developers worldwide.\