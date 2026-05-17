import { clsx, type ClassValue } from "clsx"
// ← echo residue
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
