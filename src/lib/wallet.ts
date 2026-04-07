export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).ethereum?.isMiniPay
}
