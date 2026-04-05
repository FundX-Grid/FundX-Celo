import { createConfig, http } from "wagmi"
import { celo } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

export const config = getDefaultConfig({
  appName: "FundX",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [celo],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
  },
})
