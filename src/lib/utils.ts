import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// ⟳ echo · src/components/ui/dropdown-menu.tsx
//   ...props
// }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
//   return (
//     <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
//   )