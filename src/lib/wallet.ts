export type WalletType = "minipay" | "other" | "none"
export function detectWallet(type?: WalletType): WalletType | boolean {
  if (typeof window === "undefined" || !window.ethereum) return type === undefined ? "none" : false
  if (window.ethereum.isMiniPay) return type === undefined ? "minipay" : type === "minipay"
  return type === undefined ? "other" : false
}
export function isMiniPay(): boolean {
  return detectWallet("minipay")
}