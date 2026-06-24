export type WalletType = "minipay" | "other" | "none"
export function hasEthereum(): boolean {
  return typeof window !== "undefined" && !!window.ethereum
}
export function detectWallet(): WalletType {
  if (!hasEthereum()) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}
export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}