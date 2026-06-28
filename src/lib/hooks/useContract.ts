import { FUNDX_CONTRACT, TOKEN_ADDRESSES, TOKEN_DECIMALS } from '@/lib/celo-config';
import { FUNDX_ABI } from '@/lib/fundx-abi';
import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';

export type CampaignStatus = 'active' | 'successful' | 'failed';

export interface OnChainCampaign {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  creator: string;
  token: string;
  currency: 'cUSD' | 'USDC';
  goal: number;
  raised: number;
  deadline: number;
  daysLeft: number;
  fundingModel: 'Flexible Model' | 'All-or-Nothing';
  status: CampaignStatus;
  active: boolean;
  withdrawn: boolean;
}

const PLACEHOLDER_IMAGES = ['/campaign-1.jpg', '/campaign-2.jpg', '/campaign-3.jpg'];

function getCurrency(token: string): 'cUSD' | 'USDC' {
  return token.toLowerCase() === TOKEN_ADDRESSES.cUSD.toLowerCase() ? 'cUSD' : 'USDC';
}

function getDecimals(currency: 'cUSD' | 'USDC'): number {
  return currency === 'cUSD' ? TOKEN_DECIMALS.cUSD : TOKEN_DECIMALS.USDC;
}

function calculateDaysLeft(deadline: number): number {
  const nowSec = Math.floor(Date.now() / 1000);
  const isPast = deadline < nowSec;
  return isPast ? 0 : Math.ceil((deadline - nowSec) / 86400);
}

function calculateStatus(
  isPast: boolean,
  isFlexible: boolean,
  raised: number,
  goal: number
): CampaignStatus {
  if (!isPast) return 'active';
  return isFlexible || raised >= goal ? 'successful' : 'failed';
}

function mapContractCampaign(raw: any, index: number): OnChainCampaign {
  const deadline = Number(raw.deadline);
  const isPast = deadline < Math.floor(Date.now() / 1000);
  const isFlexible = raw.fundingModel === 0;
  const currency = getCurrency(raw.token);
  const decimals = getDecimals(currency);
  const goal = parseFloat(formatUnits(raw.goal as bigint, decimals));
  const raised = parseFloat(formatUnits(raw.totalRaised as bigint, decimals));
  const daysLeft = calculateDaysLeft(deadline);
  const status = calculateStatus(isPast, isFlexible, raised, goal);

  return {
    id: String(index),
    title: `Campaign #${index}`,
    description: 'A verified on-chain campaign raising funds on Celo.',
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    category: 'DeFi',
    creator: raw.creator,
    token: raw.token,
    currency,
    goal,
    raised,
    deadline,
    daysLeft,
    fundingModel: isFlexible ? 'Flexible Model' : 'All-or-Nothing',
    status,
    active: raw.active,
    withdrawn: raw.withdrawn,
  };
}

export function useCampaignCount() {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'campaignCount_',
  });
}

export function useCampaign(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'getCampaign',
    args: [BigInt(id)],
  });
}

export function useDonation(campaignId: number, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'getDonation',
    args: donor ? [BigInt(campaignId), donor] : undefined,
    query: { enabled: !!donor },
  });
}

export function useIsPastDeadline(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'isPastDeadline',
    args: [BigInt(id)],
  });
}

export function useIsGoalReached(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'isGoalReached',
    args: [BigInt(id)],
  });
}

export function useAllCampaigns() {
  const { data: countData, isLoading: isCountLoading } = useCampaignCount();
  const count = countData ? Number(countData) : 0;
  const contracts = Array.from({ length: count }, (_, i) => ({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: 'getCampaign' as const,
    args: [BigInt(i)] as [bigint],
  }));
  const { data, isLoading: isBatchLoading, error, refetch } = useReadContracts({
    contracts,
    query: { enabled: count > 0 },
  });
  const campaigns: OnChainCampaign[] = (data ?? [])
    .map((result, i) => (result.status === 'success' ? mapContractCampaign(result.result, i) : null))
    .filter(Boolean) as OnChainCampaign[];
  return {
    campaigns,
    isLoading: isCountLoading || isBatchLoading,
    count,
    error,
    refetch,
  };
}
