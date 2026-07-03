export type WalletType = "minipay" | "other" | "none"

export function detectWallet(): WalletType {
  if (typeof window === "undefined" || !window.ethereum) return "none"
  if (window.ethereum.isMiniPay) return "minipay"
  return "other"
}

const getWalletType = (walletType: WalletType) => walletType === "minipay"

export function isMiniPay(): boolean {
  return getWalletType(detectWallet())
}
