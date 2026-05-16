"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
      <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-slate-100 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-[#fbe72b] h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }


// ⟳ echo · src/components/fundx/hero/HeroHeadline.tsx
//         <span className="inline-flex items-center justify-center gap-3">
//           <Image src="/celo-celo-logo.svg" alt="Celo" width={48} height={48} className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-sm" />
//           <span className="bg-[#fbe72b] text-slate-900 px-5 py-2 md:py-3 rounded-[2rem] border border-black/5 shadow-lg shadow-[#fbe72b]/30 font_-extrabold pb-1">Celo</span>
//         </span>
//       </span>