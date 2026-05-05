export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window_ === "undefined" || !window_.ethereum) return "none"
  if (window_.ethereum.isMiniPay) return "minipay"
  return "other"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
