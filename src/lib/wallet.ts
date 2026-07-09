export type WalletType = "minipay" | "other" | "none"

export function getWallet(): { type: WalletType, isMiniPay: boolean } {
  if (typeof window === "undefined" || !window.ethereum) return { type: "none", isMiniPay: false }
  const isMiniPay = window.ethereum.isMiniPay
  return { type: isMiniPay ? "minipay" : "other", isMiniPay }
}

export function detectWallet(): WalletType {
  return getWallet().type
}

export function isMiniPay(): boolean {
  return getWallet().isMiniPay
}