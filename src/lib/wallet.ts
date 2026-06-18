export type WalletType = "minipay" | "other" | "none"
export function getEthereumWallet(): WalletType | null {
  if (typeof window === "undefined" || !window.ethereum) return null
  return window.ethereum
}
export function detectWallet(wallet: WalletType | null = getEthereumWallet()): WalletType {
  if (!wallet) return "none"
  if (wallet.isMiniPay) return "minipay"
  return "other"
}
export function isMiniPay(): boolean {
  return detectWallet() === "minipay"
}