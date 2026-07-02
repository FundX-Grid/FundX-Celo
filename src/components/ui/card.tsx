import * as React from "react"

import { cn } from "@/lib/utils"

function baseComponent({ dataSlot, defaultClassName, className, ...props }: React.ComponentProps<"div"> & { dataSlot: string }) {
  return (
    <div
      data-slot={dataSlot}
      className={cn(defaultClassName, className)}
      {...props}
    />
  )
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card",
    defaultClassName: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
    className,
    ...props,
  })
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-header",
    defaultClassName: "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
    className,
    ...props,
  })
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-title",
    defaultClassName: "leading-none font-semibold",
    className,
    ...props,
  })
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-description",
    defaultClassName: "text-muted-foreground text-sm",
    className,
    ...props,
  })
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-action",
    defaultClassName: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    className,
    ...props,
  })
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-content",
    defaultClassName: "px-6",
    className,
    ...props,
  })
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return baseComponent({
    dataSlot: "card-footer",
    defaultClassName: "flex items-center px-6 [.border-t]:pt-6",
    className,
    ...props,
  })
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}