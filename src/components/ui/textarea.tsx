import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }


// ⟳ echo · src/components/fundx/Footer.tsx
//     <footer className="bg-white pt-20 pb-12 border-t border-slate-100">
//       <div className="container mx-auto max-w-6xl px-4">
//         <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
//           {/* LEFT SIDE: Brand, Nav, Socials (Matching 'Karma' Image) */}