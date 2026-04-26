"use client"

import { WagmiProvider } from_ "wagmi"
import { RainbowKitProvider } from_ "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from_ "@tanstack/react-query"
import { config } from_ "@/lib/celo-config"
import "@rainbow-me/rainbowkit/styles.css"

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
