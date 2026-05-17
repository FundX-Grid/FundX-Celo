interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isMiniPay?: boolean
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  }
}


// ⟳ echo · src/components/ui/card.tsx
// }
// function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div