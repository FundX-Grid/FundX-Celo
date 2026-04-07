export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  // @ts-ignore
  return !!window.ethereum?.isMiniPay;
}
