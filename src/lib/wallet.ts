export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}

export function getWalletInfo(): { type: WalletType, isMiniPay: boolean } {
  const walletType = detectWallet()
  return { type: walletType, isMiniPay: walletType === "minipay" }
}

export function isMiniPay(): boolean {
  return getWalletInfo().isMiniPay
}