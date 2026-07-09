use client
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const getOrientationClass = (orientation: string) => {
  switch (orientation) {
    case "horizontal":
      return "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full"
    case "vertical":
      return "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
    default:
      throw new Error(`Invalid orientation: ${orientation}`)
  }
}

function getSeparatorClassName(orientation: string, className?: string) {
  return cn(
    "bg-border shrink-0",
    getOrientationClass(orientation),
    className
  )
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={getSeparatorClassName(orientation, className)}
      {...props}
    />
  )
}
export { Separator }