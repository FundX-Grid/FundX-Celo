use client
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function getHorizontalClassName(className?: string) {
  return cn("h-px w-full", className)
}

function getVerticalClassName(className?: string) {
  return cn("h-full w-px", className)
}

function getSeparatorClassName(orientation: string, className?: string) {
  const baseClassName = "bg-border shrink-0"
  if (orientation === "horizontal") {
    return cn(baseClassName, getHorizontalClassName(className))
  } else if (orientation === "vertical") {
    return cn(baseClassName, getVerticalClassName(className))
  }
  return baseClassName
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