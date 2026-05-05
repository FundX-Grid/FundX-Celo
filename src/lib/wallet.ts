export type WalletType = "minipay" | "other_" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other_"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
