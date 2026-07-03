import { useState, useEffect } from "react"
import Link from "next/link"
import Logo from "@/components/Logo"
import { ConnectWallet } from "@/components/fundx/ConnectWallet"
import { useAccount } from "wagmi"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { isConnected } = useAccount()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const navLinks = [
    { href: \