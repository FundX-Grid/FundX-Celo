interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isMiniPay?: boolean
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  }
}


// ⟳ echo · src/app/explore/page.tsx
// import { Search, ArrowUp, Sparkles, Filter } from "lucide-react" // 🚨 ADDED: Filter icon
// import { CAMPAIGNS } from "@/lib/data"
// const CATEGORIES = ["All", "DeFi", "Mining", "Gaming", "Social Impact", "Infrastructure"]
// const STATUSES = ["All", "active", "successful", "failed"] // 🚨 ADDED: Status options
// export default function ExplorePage() {