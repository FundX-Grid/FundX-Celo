"use client"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/celo-config"
import "@rainbow-me/rainbowkit/styles.css"

const createQueryClient = () => new QueryClient()
const createWagmiConfig = () => ({ config })

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = createQueryClient()
  const wagmiConfig = createWagmiConfig()

  return (
    <WagmiProvider config={wagmiConfig.config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}