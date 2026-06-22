interface Window { ethereum?: { isMetaMask?: boolean; isMiniPay?: boolean; request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on: (event: string, handler: (...args: unknown[]) => void) => void; removeListener: (event: string, handler: (...args: unknown[]) => void) => void; } }

function hasEthereumProperty(window: Window, property: string): boolean {
  return window.ethereum !== undefined && property in window.ethereum;
}
