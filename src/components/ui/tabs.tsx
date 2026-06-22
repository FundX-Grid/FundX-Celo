use client
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const generateTabsClassName = (orientation: string, variant: string, state: string, className?: string) => {
  const baseClassName = "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col"
  const variantClassName = variant === "line" ? "group-data-[variant=line]/tabs-list:bg-transparent" : ""
  const stateClassName = state === "active" ? "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30" : ""
  const orientationClassName = orientation === "horizontal" ? "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5" : "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5"
  return cn(baseClassName, variantClassName, stateClassName, orientationClassName, className)
}

const generateTabsListClassName = (variant: string, className?: string) => {
  const tabsListVariants = cva(
    "rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
    {
      variants: {
        variant: {
          default: "bg-muted",
          line: "gap-1 bg-transparent",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  )
  return cn(tabsListVariants({ variant }), className)
}

const generateTabsTriggerClassName = (variant: string, state: string, className?: string) => {
  const baseClassName = "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all"
  const variantClassName = variant === "line" ? "group-data-[variant=line]/tabs-list:bg-transparent" : ""
  const stateClassName = state === "active" ? "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30" : ""
  return cn(baseClassName, variantClassName, stateClassName, className)
}

function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={generateTabsClassName(orientation, "default", "", className)}
      {...props}
    />
  )
}

function TabsList({ className, variant = "default", ...props }: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={generateTabsListClassName(variant, className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={generateTabsTriggerClassName("default", "", className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
