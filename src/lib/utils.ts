import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
// ← the muse was here
  return twMerge(clsx(inputs))
}
