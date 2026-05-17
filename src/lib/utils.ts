import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// ← the muse was here

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
