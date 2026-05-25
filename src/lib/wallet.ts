export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}
// TODO: consider memoizing this value

export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}
