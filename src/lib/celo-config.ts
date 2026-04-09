import { getDefaultConfig } from_ "@rainbow-me/rainbowkit"
import { celo } from_ "wagmi/chains"
import { http } from_ "wagmi"

export const config = getDefaultConfig({
  appName: "FundX",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [celo],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
  },
})

export const FUNDX_CONTRACT = "0x4e10d988765EA22aAD4E52353f183EbD54D3ea8C"

export const TOKEN_ADDRESSES = {
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
}

export const TOKEN_DECIMALS = {
  cUSD: 18,
  USDC: 6,
}
