use client
import { useState, use, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/fundx/Navbar"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, ShieldCheck, Share2, MapPin, ArrowLeft, Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react"
import { useAccount, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { parseUnits, formatUnits, erc20Abi } from "viem"
import { FUNDX_ABI } from "@/lib/fundx-abi"
import { FUNDX_CONTRACT, TOKEN_ADDRESSES, TOKEN_DECIMALS, config } from "@/lib/celo-config"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { toast } from "sonner"
import { useCampaign, useDonation } from "@/lib/hooks/useContract"
import { getCampaign } from "@/lib/data"
import { isMiniPay } from "@/lib/wallet"
const PLACEHOLDER_IMAGES = ["/campaign-1.jpg", "/campaign-2.jpg", "/campaign-3.jpg"]
export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { isConnected, address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [donateAmount, setDonateAmount] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isMini, setIsMini] = useState(false)
  const [txPending, setTxPending] = useState(false)
  const { id } = use(params)
  const campaignIndex = Number(id)
  useEffect(() => {
    setMounted(true)
    setIsMini(isMiniPay())
  }, [])
  const isMockId = isNaN(campaignIndex)
  const { data: raw, isLoading, error, refetch } = useCampaign(isMockId ? 0 : campaignIndex)
  const { data: userDonationRaw } = useDonation(campaignIndex, address)
  if (!mounted || (!isMockId && isLoading)) return (
    <main className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </main>
  )
  if (isMockId) {
    const mockCampaign = getCampaign(id)
    if (!mockCampaign) return notFound()
    const mockProgress = Math.min((mockCampaign.raised / mockCampaign.goal) * 100, 100)
    return (
      // ... rest of the code remains the same ...
    )
  }
  if (!raw && error) return notFound()
  if (!raw || raw.creator === "0x0000000000000000000000000000000000000000") return notFound()
  // ... rest of the code remains the same ...
}