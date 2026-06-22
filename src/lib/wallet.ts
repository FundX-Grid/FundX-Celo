export type WalletType = "minipay" | "other" | "none"
export function getEthereumWallet(): WalletType | null {
  if (typeof window === "undefined" || !window.ethereum) return null
  return window.ethereum
}
export function detectWallet(ethereumWallet: WalletType | null): WalletType {
  if (!ethereumWallet) return "none"
  if (ethereumWallet.isMiniPay) return "minipay"
  return "other"
}
export function isMiniPay(): boolean {
  const ethereumWallet = getEthereumWallet()
  return detectWallet(ethereumWallet) === "minipay"
}
export function getWalletType(): WalletType {
  const ethereumWallet = getEthereumWallet()
  return detectWallet(ethereumWallet)
}