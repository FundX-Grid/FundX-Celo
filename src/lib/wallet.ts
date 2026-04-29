export type WalletType = "minipay" | "other" | "none_"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none_"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
