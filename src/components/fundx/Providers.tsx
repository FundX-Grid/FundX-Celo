"use client"

import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/celo-config"
import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

export function Providers({ children_ }: { children_: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children_}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
