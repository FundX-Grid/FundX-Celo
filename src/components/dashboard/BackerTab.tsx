use client
import { Clock, CheckCircle2, Rocket, RefreshCcw, ShieldAlert, Loader2, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useWriteContract, useAccount, useReadContracts } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { FUNDX_CONTRACT, TOKEN_ADDRESSES, config } from "@/lib/celo-config"
import { FUNDX_ABI } from "@/lib/fundx-abi"
import { toast } from "sonner"
import { useAllCampaigns, OnChainCampaign } from "@/lib/hooks/useContract"
import { isMiniPay } from "@/lib/wallet"
import { useMemo, useState } from "react"
import { formatUnits } from "viem"

function formatMoney(amount: number, currency: string) {
  return `$${amount.toLocaleString()} ${currency}`
}

interface Contribution {
  campaign: OnChainCampaign
  myContribution: number
  status: "active" | "successful" | "refund_available"
}

const handleRefundHelper = async (
  writeContractAsync: any,
  c: Contribution,
  onSuccess: () => void,
  setPending: (pending: boolean) => void,
  mini: boolean
) => {
  const tokenAddress =
    c.campaign.currency === "cUSD"
      ? TOKEN_ADDRESSES.cUSD
      : TOKEN_ADDRESSES.USDC
  const feeCurrency = mini
    ? (TOKEN_ADDRESSES.cUSD as `0x${string}`)
    : (tokenAddress as `0x${string}`)
  try {
    setPending(true)
    toast.loading("Claiming refund...", { id: `refund-${c.campaign.id}` })
    const hash = await writeContractAsync({
      address: FUNDX_CONTRACT as `0x${string}`,
      abi: FUNDX_ABI,
      functionName: "claimRefund",
      args: [BigInt(c.campaign.id)],
      feeCurrency,
    } as any)
    await waitForTransactionReceipt(config, { hash })
    toast.success(
      `Refund of ${c.myContribution} ${c.campaign.currency} claimed!`,
      { id: `refund-${c.campaign.id}` }
    )
    onSuccess()
  } catch (err) {
    console.error(err)
    toast.error(
      "Refund Failed",
      {
        id: `refund-${c.campaign.id}`,
        description: "Transaction failed on Celo.",
      }
    )
  } finally {
    setPending(false)
  }
}

function RefundCard({ c, onSuccess }: { c: Contribution; onSuccess: () => void }) {
  const { writeContractAsync } = useWriteContract()
  const [pending, setPending] = useState(false)
  const mini = typeof window !== "undefined" && isMiniPay()

  const handleRefund = async () => {
    await handleRefundHelper(
      writeContractAsync,
      c,
      onSuccess,
      setPending,
      mini
    )
  }

  return (
    // ... rest of the code remains the same ...
  )
}

function ActiveCard({ c }: { c: Contribution }) {
  // ... rest of the code remains the same ...
}
