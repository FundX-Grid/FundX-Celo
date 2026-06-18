use client
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/celo-config"
import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

const createProviders = (children: React.ReactNode) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

export function Providers({ children }: { children: React.ReactNode }) {
  return createProviders(children)
}