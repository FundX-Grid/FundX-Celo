import { clsx, type ClassValue } from "clsx"
// TODO: add input validation
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
