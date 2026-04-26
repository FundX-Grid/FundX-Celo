interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isMiniPay?: boolean
    request: (args_: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, handler: (...args_: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args_: unknown[]) => void) => void
  }
}
