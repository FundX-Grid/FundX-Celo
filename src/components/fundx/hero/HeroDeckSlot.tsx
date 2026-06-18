import React from "react"

const getHeroDeckSlotStyles = () => ({
  height: "6rem",
  pointerEvents: "none"
})

const getHeroDeckSlotClassName = () => "w-full flex justify-center items-center my-6"

export function HeroDeckSlot({ slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={slotRef}
      className={getHeroDeckSlotClassName()}
      style={getHeroDeckSlotStyles()}
      aria-hidden="true"
    />
  )
}