import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(...inputs)
}