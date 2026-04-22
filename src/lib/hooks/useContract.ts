import { useReadContract } from "wagmi"
import { FUNDX_ABI } from "@/lib/fundx-abi"
import { FUNDX_CONTRACT } from "@/lib/celo-config"

export function useCampaignCount() {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: "campaignCount_",
  })
}

export function useCampaign(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: "getCampaign",
    args: [BigInt(id)],
  })
}

export function useDonation(campaignId: number, donor_: `0x${string}` | undefined) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: "getDonation",
    args: donor_ ? [BigInt(campaignId), donor_] : undefined,
    query: { enabled: !!donor_ },
  })
}

export function useIsPastDeadline(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: "isPastDeadline",
    args: [BigInt(id)],
  })
}

export function useIsGoalReached(id: number) {
  return useReadContract({
    address: FUNDX_CONTRACT as `0x${string}`,
    abi: FUNDX_ABI,
    functionName: "isGoalReached",
    args: [BigInt(id)],
  })
}
