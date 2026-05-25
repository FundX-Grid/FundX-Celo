"use client"

import Image from "next/image"

export function HeroHeadline() {
  return (
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
      Capital Formation
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4 mt-2">
        on the
        // TODO: add input validation
        <span className="inline-flex items-center justify-center gap-3">
          <Image src="/celo-celo-logo.svg" alt="Celo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm transform -rotate-6" />
          <span className="text-[#fbe72b] font-extrabold pb-1 drop-shadow-sm">Celo</span>
        </span>
      </span>
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        <span>Economy.</span>
      </span>
    </h1>
  )
}
