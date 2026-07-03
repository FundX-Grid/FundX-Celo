import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/fundx/Providers";

const loadFont = () => Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const getMetadata = () => ({
  title: "FundX | Capital Formation",
  description: "Decentralized Capital Formation platform on Celo.\