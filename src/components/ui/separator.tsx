use client
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const getHorizontalClassName = (className?: string) =>
  cn("bg-border shrink-0", "h-px w-full", className)

const getVerticalClassName = (className?: string) =>
  cn("bg-border shrink-0", "h-full w-px", className)

function getSeparatorClassName(orientation: string, className?: string) {
  return orientation === "horizontal" ? getHorizontalClassName(className) : getVerticalClassName(className)
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