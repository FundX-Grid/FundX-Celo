export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}


// ⟳ echo · src/components/fundx/LogoStrip.tsx
//           </div>
//           <div className="flex items-center justify-center h-12 cursor-default group">
//             <span className="text-3xl font-bold tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-[#fbe72b]">
//               MiniPay
//             </span>