interface CampaignProgressProps {
  progress: number
  /** "lg" is used by the featured center card: taller bar with a glow. */
  size?: "sm" | "lg"
}

export function CampaignProgress({ progress, size = "sm" }: CampaignProgressProps) {
  const track = size === "lg" ? "h-3" : "h-2"
  const bar =
    size === "lg"
      ? "bg-gradient-tush h-full rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]"
      : "bg-gradient-tush h-full rounded-full"

  return (
    <div className={`w-full bg-slate-100 rounded-full ${track} overflow-hidden`}>
      <div className={bar} style={{ width: `${progress}%` }} />
    </div>
  )
}
