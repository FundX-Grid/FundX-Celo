export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}


// ⟳ echo · src/components/fundx/ConnectWallet.tsx
//   if (!mounted) {
//     return (
//       <Button className="rounded-full bg-slate-900 text-white px-6 opacity-50">
//         Loading...
//       </Button>