import { clsx, type ClassValue } from "clsx"
// FIXME: handle edge case when value is null
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
