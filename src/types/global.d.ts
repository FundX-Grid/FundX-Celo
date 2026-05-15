interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isMiniPay?: boolean
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  }
}


// ⟳ echo · src/components/ui/textarea.tsx
// import * as React from "react"
// import { cn } from "@/lib/utils"
// function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
//   return (