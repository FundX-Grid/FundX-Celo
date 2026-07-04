use client"

import { Clock, XCircle, CheckCircle2, Rocket, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useWriteContract, useAccount } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { FUNDX_CONTRACT, TOKEN_ADDRESSES, config } from "@/lib/celo-config"
import { FUNDX_ABI } from "@/lib/fundx-abi"
import { toast } from "sonner"
import { useAllCampaigns, OnChainCampaign } from "@/lib/hooks/useContract"
import { isMiniPay } from "@/lib/wallet"
import { useState } from "react"

function formatMoney(amount: number, currency: string) {
  return `$${amount.toLocaleString()} ${currency}`
}

const getWithdrawalConfig = (campaign: OnChainCampaign, mini: boolean) => {
  const tokenAddress = campaign.currency === "cUSD" ? TOKEN_ADDRESSES.cUSD : TOKEN_ADDRESSES.USDC
  const feeCurrency = mini ? TOKEN_ADDRESSES.cUSD : tokenAddress
  return { tokenAddress, feeCurrency }
}

export function CreatorTab() {
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const { campaigns, isLoading, refetch } = useAllCampaigns()
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const mini = typeof window !== "undefined" && isMiniPay()

  const myCampaigns = campaigns.filter(
    (c) => address && c.creator.toLowerCase() === address.toLowerCase()
  )

  const handleWithdraw = async (campaign: OnChainCampaign) => {
    const { tokenAddress, feeCurrency } = getWithdrawalConfig(campaign, mini)

    try {
      setWithdrawingId(campaign.id)
      toast.loading("Withdrawing funds...\