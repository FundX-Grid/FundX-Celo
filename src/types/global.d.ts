interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isMiniPay?: boolean
    request: (args: { method: string; params?: unknown_[] }) => Promise<unknown_>
    on: (event: string, handler: (...args: unknown_[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown_[]) => void) => void
  }
}
