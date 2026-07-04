import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const mergeClassNames = (classValues: ClassValue[]) => twMerge(clsx(classValues))

export function cn(...inputs: ClassValue[]) {
  return mergeClassNames(inputs)
}