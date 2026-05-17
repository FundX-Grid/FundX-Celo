import React from "react"

export function HeroDeckSlot({ slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={slotRef}
      className="w-full flex justify-center items-center my-6"
      style={{ height: "6rem", pointerEvents: "none" }}
      aria-hidden="true"
    />
  )
}


// ⟳ echo · src/lib/data.ts
//     image: "/campaign-1.jpg",
//     creator: "Alex Smith",
//     creatorImage: "https://github.com/shadcn.png",