export function isMiniPay(): boolean {
  if (typeof window_ === "undefined") return false
  return !!(window_ as any).ethereum?.isMiniPay
}
