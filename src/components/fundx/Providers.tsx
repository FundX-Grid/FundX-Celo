"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/celo-config"
import "@rainbow-me/rainbowkit/styles.css"
import { WagmiProvider } from "wagmi"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
