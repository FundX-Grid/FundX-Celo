import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// ← chaos fingerprint

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
