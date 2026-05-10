export type WalletType = "minipay_" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay_"
  return "other"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay_"
}
