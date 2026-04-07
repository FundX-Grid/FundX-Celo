"use client"


export function HeroHeadline() {
  return (
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
      Capital Formation
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
        on the
        <span style={{ display: "inline-block", fontVariantLigatures: "none" }} className="bg-clip-text text-transparent bg-gradient-to-r from-[#17C87E] to-[#10B981]">
          Celo
        </span>
      </span>
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
        <span>Economy.</span>
      </span>
    </h1>
  )
}
