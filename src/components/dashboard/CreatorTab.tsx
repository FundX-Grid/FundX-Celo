import { Clock, XCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"

export function CreatorTab() {
  return (
    <TabsContent value="campaigns" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       {/* 1. SUCCESSFUL CAMPAIGN (Bento Clean + Dark Lifted Shadow) */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          {/* Clean accent line */}
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
          
          <div className="flex-1 space-y-2 w-full pl-2">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Successful
                </span>
                <span className="text-slate-400 text-sm font-semibold">Flexible Model</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">DeFi Yield Aggregator</h3>
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-700 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                   Raised: <span className="text-green-600 font-extrabold">$55,000 USDCx</span>
                </div>
                <div className="text-slate-500 font-medium">Goal: $50,000</div>
             </div>
          </div>
          <div className="w-full md:w-auto shrink-0">
             <Button className="w-full md:w-auto h-12 px-8 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md font-bold text-base transition-all">
                Withdraw Funds
             </Button>
          </div>
       </div>

       {/* 2. ACTIVE CAMPAIGN (Bento Clean + Dark Lifted Shadow) */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-tush" />
          
          <div className="flex-1 space-y-2 w-full pl-2">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" /> Active
                </span>
                <span className="text-slate-400 text-sm font-semibold">All-or-Nothing</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Stacks Dev Bootcamp</h3>
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-700 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                   Raised: <span className="text-orange-600 font-extrabold">4,500 STX</span>
                </div>
                <div className="text-slate-500 font-medium">Goal: 10,000 STX</div>
             </div>
             {/* Clean Progress Bar */}
             <div className="w-full max-w-md bg-slate-100 rounded-full h-2 mt-5 overflow-hidden">
                <div className="bg-gradient-tush h-full rounded-full" style={{ width: "45%" }} />
             </div>
          </div>
          <div className="w-full md:w-auto shrink-0 text-left md:text-right px-4">
             <div className="text-3xl font-black text-slate-900 tracking-tight">12 Days</div>
             <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Remaining</div>
          </div>
       </div>

       {/* 3. FAILED CAMPAIGN (Flat & Muted to contrast with active cards) */}
       <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
          <div className="absolute top-0 left-0 w-2 h-full bg-slate-300" />
          
          <div className="flex-1 space-y-2 w-full pl-2">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-white border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <XCircle className="w-3.5 h-3.5 text-red-500" /> Failed
                </span>
                <span className="text-slate-400 text-sm font-semibold">All-or-Nothing</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-500 line-through decoration-slate-300 decoration-2 tracking-tight">NFT Marketplace</h3>
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-500 bg-white px-4 py-1.5 rounded-lg border border-slate-200">
                   Raised: 1,200 STX
               </div>
                <div className="text-slate-500 font-medium">Goal: 50,000 STX</div>
             </div>
          </div>
          <div className="w-full md:w-auto shrink-0">
             <Button variant="outline" disabled className="w-full md:w-auto h-12 px-8 rounded-xl bg-white border-slate-200 text-slate-400 font-bold">
                Goal Not Met
             </Button>
          </div>
       </div>

    </TabsContent>
  )
}