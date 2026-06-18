"use client"

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

  // Mock campaign short-circuit — rendered before contract hooks resolve
  const mockCampaign = isMockId ? getCampaign(id) : null

  if (!mounted || (!isMockId && isLoading)) {
    return (
      <main className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </main>
    )
  }

  if (isMockId) {
    if (!mockCampaign) return notFound()
    // TODO: add input validation
    const mockProgress = Math.min((mockCampaign.raised / mockCampaign.goal) * 100, 100)
    return (
      <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
          <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to campaigns
          </Link>
          <div className="mb-10">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="text-orange-600 bg-orange-50 border-orange-100 px-3 py-1 text-sm">Demo Campaign</Badge>
              <Badge variant="secondary" className="text-slate-500 bg-slate-50 border-slate-200 px-3 py-1 text-sm">{mockCampaign.category}</Badge>
              <div className="flex items-center text-slate-500 text-sm font-medium"><MapPin className="w-3 h-3 mr-1" />{mockCampaign.location}</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">{mockCampaign.title}</h1>
            <p className="text-xl text-slate-500 max-w-3xl">{mockCampaign.description}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-200 shadow-sm border border-slate-100">
                <Image src={mockCampaign.image} alt={mockCampaign.title} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-4 border-y border-slate-200 py-6">
                <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
                  <AvatarImage src={mockCampaign.creatorImage} />
                  <AvatarFallback>{mockCampaign.creator.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Organized by</p>
                  <p className="font-bold text-slate-900 text-lg">{mockCampaign.creator}</p>
                </div>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <p>{mockCampaign.description}</p>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 not-prose mt-6">
                  <h4 className="font-bold text-orange-800 mb-2">Demo Campaign</h4>
                  <p className="text-orange-700/80 text-sm">This is a showcase campaign. On-chain donations are only available for live deployed campaigns.</p>
                </div>
              </div>
            </div>
            <div className="relative h-full">
              <div className="sticky top-32 p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl space-y-6">
                <div className="space-y-5">
                  <div>
                    <div className="text-4xl font-black text-slate-900">${mockCampaign.raised.toLocaleString()} <span className="text-xl font-bold text-slate-400">{mockCampaign.currency}</span></div>
                    <div className="text-base text-slate-400">of ${mockCampaign.goal.toLocaleString()} goal</div>
                  </div>
                  <Progress value={mockProgress} className="h-3 bg-slate-100" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>{Math.round(mockProgress)}% funded</span>
                    <span className="flex items-center gap-1 text-orange-500"><Clock className="w-4 h-4" />{mockCampaign.daysLeft}d left</span>
                  </div>
                </div>
                <Separator />
                <Button disabled className="w-full h-14 rounded-xl bg-slate-200 text-slate-400 text-lg font-bold cursor-not-allowed">
                  Demo — Not Live
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-3 h-3" /> Deploy a real campaign to accept donations
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!raw && error) return notFound()

  if (!raw || raw.creator === "0x0000000000000000000000000000000000000000") return notFound()

  // — Derived values —
  const nowSec = Math.floor(Date.now() / 1000)
  const isCUSD = raw.token.toLowerCase() === TOKEN_ADDRESSES.cUSD.toLowerCase()
  const currency = isCUSD ? "cUSD" : "USDC"
  const decimals = isCUSD ? TOKEN_DECIMALS.cUSD : TOKEN_DECIMALS.USDC
  const goal = Number(formatUnits(raw.goal, decimals))
  const raised = Number(formatUnits(raw.totalRaised, decimals))
  const deadline = Number(raw.deadline)
  const isPast = deadline < nowSec
  const isFlexible = raw.fundingModel === 0
  const goalReached = raw.totalRaised >= raw.goal
  const daysLeft = isPast ? 0 : Math.ceil((deadline - nowSec) / 86400)
  const progress = Math.min((raised / goal) * 100, 100)
  const userDonation = userDonationRaw ? Number(formatUnits(userDonationRaw as bigint, decimals)) : 0

  const status: "active" | "successful" | "failed" =
    !isPast ? "active" : isFlexible || goalReached ? "successful" : "failed"

  const isCreator = address && raw.creator.toLowerCase() === address.toLowerCase()
  const canWithdraw = isCreator && isPast && !raw.withdrawn && (isFlexible || goalReached)
  const canRefund = !isFlexible && isPast && !goalReached && userDonation > 0

  const image = PLACEHOLDER_IMAGES[campaignIndex % PLACEHOLDER_IMAGES.length]
  const creatorShort = `${raw.creator.slice(0, 6)}...${raw.creator.slice(-4)}`

  // — Donate guard —
  let donateDisabledReason = ""
  if (isPast) donateDisabledReason = "Campaign Ended"
  else if (!raw.active) donateDisabledReason = "Campaign Closed"
  else if (!isFlexible && goalReached) donateDisabledReason = "Goal Reached"

  // — Handlers —
  const handleDonate = async () => {
    if (!isConnected && !isMini) {
      toast.error("Connect Wallet", { description: "Please connect your wallet to donate." })
      return
    }
    if (!donateAmount || Number(donateAmount) <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid amount." })
      return
    }
    const tokenAddress = isCUSD ? TOKEN_ADDRESSES.cUSD : TOKEN_ADDRESSES.USDC
    const feeCurrency = isMini ? (TOKEN_ADDRESSES.cUSD as `0x${string}`) : (tokenAddress as `0x${string}`)
    const amountUnits = parseUnits(donateAmount, decimals)

    try {
      setTxPending(true)
      toast.loading("Approving token...", { id: "donate" })

      const approveHash = await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [FUNDX_CONTRACT as `0x${string}`, amountUnits],
        feeCurrency,
      } as any)
      await waitForTransactionReceipt(config, { hash: approveHash })

      toast.loading("Sending donation...", { id: "donate" })
      const donateHash = await writeContractAsync({
        address: FUNDX_CONTRACT as `0x${string}`,
        abi: FUNDX_ABI,
        functionName: "donate",
        args: [BigInt(campaignIndex), amountUnits],
        feeCurrency,
      } as any)

      const receipt = await waitForTransactionReceipt(config, { hash: donateHash })
      if (receipt.status !== "success") throw new Error("Reverted on-chain")

      toast.success("Contribution confirmed!", { id: "donate" })
      setDonateAmount("")
      refetch()
    } catch (err) {
      console.error(err)
      toast.error("Donation Failed", { id: "donate", description: "Transaction failed on Celo." })
    } finally {
      setTxPending(false)
    }
  }

  const handleWithdraw = async () => {
    const tokenAddress = isCUSD ? TOKEN_ADDRESSES.cUSD : TOKEN_ADDRESSES.USDC
    const feeCurrency = isMini ? (TOKEN_ADDRESSES.cUSD as `0x${string}`) : (tokenAddress as `0x${string}`)
    try {
      setTxPending(true)
      toast.loading("Withdrawing funds...", { id: "withdraw" })
      const hash = await writeContractAsync({
        address: FUNDX_CONTRACT as `0x${string}`,
        abi: FUNDX_ABI,
        functionName: "withdraw",
        args: [BigInt(campaignIndex)],
        feeCurrency,
      } as any)
      const receipt = await waitForTransactionReceipt(config, { hash })
      if (receipt.status !== "success") throw new Error("Reverted on-chain")
      toast.success("Funds withdrawn successfully!", { id: "withdraw" })
      refetch()
    } catch (err) {
      console.error(err)
      toast.error("Withdrawal Failed", { id: "withdraw", description: "Transaction failed on Celo." })
    } finally {
      setTxPending(false)
    }
  }

  const handleRefund = async () => {
    const tokenAddress = isCUSD ? TOKEN_ADDRESSES.cUSD : TOKEN_ADDRESSES.USDC
    const feeCurrency = isMini ? (TOKEN_ADDRESSES.cUSD as `0x${string}`) : (tokenAddress as `0x${string}`)
    try {
      setTxPending(true)
      toast.loading("Claiming refund...", { id: "refund" })
      const hash = await writeContractAsync({
        address: FUNDX_CONTRACT as `0x${string}`,
        abi: FUNDX_ABI,
        functionName: "claimRefund",
        args: [BigInt(campaignIndex)],
        feeCurrency,
      } as any)
      const receipt = await waitForTransactionReceipt(config, { hash })
      if (receipt.status !== "success") throw new Error("Reverted on-chain")
      toast.success(`Refund of ${userDonation} ${currency} claimed!`, { id: "refund" })
      refetch()
    } catch (err) {
      console.error(err)
      toast.error("Refund Failed", { id: "refund", description: "Transaction failed on Celo." })
    } finally {
      setTxPending(false)
    }
  }

  const statusBadge = {
    active: { label: "Active", className: "text-green-600 bg-green-50 border-green-100" },
    successful: { label: "Funded", className: "text-blue-600 bg-blue-50 border-blue-100" },
    failed: { label: "Failed", className: "text-red-600 bg-red-50 border-red-100" },
  }[status]

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">

        <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to campaigns
        </Link>

        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
            <Badge variant="secondary" className={`px-3 py-1 text-sm border ${statusBadge.className}`}>
              {status === "active" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
              {status === "failed" && <XCircle className="w-3 h-3 mr-1 inline" />}
              {statusBadge.label}
            </Badge>
            <Badge variant="secondary" className="text-slate-500 bg-slate-50 border-slate-200 px-3 py-1 text-sm">
              {isFlexible ? "Flexible Model" : "All-or-Nothing"}
            </Badge>
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <MapPin className="w-3 h-3 mr-1" /> Celo Network
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Campaign #{id}
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl">
            A verified on-chain campaign raising {currency} on the Celo network.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT: Content */}
          <div className="lg:col-span-2 space-y-10">

            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-200 shadow-sm border border-slate-100">
              <Image src={image} alt={`Campaign #${id}`} fill className="object-cover" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-slate-200 py-6 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
                  <AvatarFallback>{creatorShort.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Deployed by</p>
                  <p className="font-bold text-slate-900 font-mono text-base">{creatorShort}</p>
                </div>
              </div>
              <div className="flex gap-6 text-slate-600 font-medium">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> Verified</div>
                {userDonation > 0 && (
                  <div className="flex items-center gap-2 text-orange-500">
                    <Wallet className="w-5 h-5" /> You contributed {userDonation} {currency}
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 mb-8">
                <TabsTrigger value="story" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  Campaign Info
                </TabsTrigger>
                <TabsTrigger value="updates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  Updates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="prose prose-slate prose-lg max-w-none text-slate-600">
                <div className="grid grid-cols-2 gap-6 not-prose mb-8">
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Funding Model</p>
                    <p className="text-lg font-bold text-slate-900">{isFlexible ? "Flexible" : "All-or-Nothing"}</p>
                    <p className="text-xs text-slate-400 mt-1">{isFlexible ? "Creator can withdraw at any time after deadline" : "Refunds issued if goal not met"}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Token</p>
                    <p className="text-lg font-bold text-slate-900">{currency}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{raw.token.slice(0, 10)}...{raw.token.slice(-6)}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-lg font-bold text-slate-900">{new Date(deadline * 1000).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400 mt-1">{isPast ? "Ended" : `${daysLeft} days remaining`}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contract</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{FUNDX_CONTRACT.slice(0, 8)}...{FUNDX_CONTRACT.slice(-6)}</p>
                    <p className="text-xs text-slate-400 mt-1">Celo Mainnet</p>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 not-prose">
                  <h4 className="font-bold text-orange-800 mb-2">Smart Contract Enforced</h4>
                  <p className="text-orange-700/80 text-sm">
                    All fund movements are governed entirely by the FundX Escrow contract on Celo. No custodians, no discretion.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="updates" className="py-8 text-center text-slate-500">
                No updates yet.
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: Sticky funding panel */}
          <div className="relative h-full">
            <div className="sticky top-32 p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl space-y-6">

              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="text-4xl font-black text-slate-900 tracking-tight">
                    ${raised.toLocaleString()} <span className="text-xl font-bold text-slate-400">{currency}</span>
                  </div>
                  <div className="text-base font-medium text-slate-400">of ${goal.toLocaleString()} goal</div>
                </div>

                <Progress value={progress} className="h-3 bg-slate-100" />

                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-slate-900">{Math.round(progress)}% funded</span>
                  <span className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-4 h-4" />
                    {isPast ? "Ended" : `${daysLeft}d left`}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Creator: Withdraw */}
              {canWithdraw && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <p className="text-sm font-bold text-green-800 mb-1">You are the creator</p>
                  <p className="text-xs text-green-600 mb-4">
                    {raised > 0 ? `$${raised.toLocaleString()} ${currency} is ready to withdraw.` : "No funds to withdraw."}
                  </p>
                  <Button
                    onClick={handleWithdraw}
                    disabled={txPending || raised === 0}
                    className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `Withdraw ${raised.toLocaleString()} ${currency}`}
                  </Button>
                </div>
              )}

              {/* Backer: Refund */}
              {canRefund && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <p className="text-sm font-bold text-red-800 mb-1">Refund available</p>
                  <p className="text-xs text-red-600 mb-4">
                    Goal was not reached. You can reclaim your {userDonation} {currency}.
                  </p>
                  <Button
                    onClick={handleRefund}
                    disabled={txPending}
                    className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `Claim ${userDonation} ${currency} Refund`}
                  </Button>
                </div>
              )}

              {/* Donor: Donate */}
              {!isCreator && status === "active" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Make a contribution</h4>
                    <p className="text-sm text-slate-500">Support this campaign.</p>
                  </div>

                  <div className={`transition-all duration-300 ${(!isConnected && !isMini) ? "opacity-50 grayscale pointer-events-none" : ""}`}>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-base ${isCUSD ? "text-green-600" : "text-blue-600"}`}>
                        {currency}
                      </span>
                      <Input
                        type="number"
                        placeholder="100"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                        className="pl-20 h-14 rounded-xl border-slate-200 bg-slate-50 text-xl font-bold focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>

                  {(isConnected || isMini) ? (
                    <Button
                      disabled={!!donateDisabledReason || txPending || !donateAmount || Number(donateAmount) <= 0}
                      onClick={handleDonate}
                      className="w-full h-14 rounded-xl bg-slate-900 text-white hover:scale-[1.02] transition-transform text-lg font-bold"
                    >
                      {txPending ? <Loader2 className="w-5 h-5 animate-spin" /> : donateDisabledReason || "Donate Now"}
                    </Button>
                  ) : (
                    <div className="flex justify-center">
                      <ConnectButton />
                    </div>
                  )}
                </div>
              )}

              {/* Creator already withdrew */}
              {isCreator && raw.withdrawn && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Funds withdrawn</p>
                  <p className="text-sm text-slate-400">This campaign has been settled.</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Secured by FundX Escrow on Celo</span>
              </div>

              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-12">
                <Share2 className="w-4 h-4 mr-2" /> Share this campaign
              </Button>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
