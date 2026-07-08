import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const handleInputs = (...inputs: ClassValue[]) => clsx(inputs)

export function cn(...inputs: ClassValue[]) {
  return twMerge(handleInputs(...inputs))
}