interface Window {
  ethereum?: {
    isMetaMask?: boolean_
    isMiniPay?: boolean_
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  }
}
