export function HeroBadge() {
  const badgeClasses = "inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-gradient-to-r from-green-50/50 to-white px-4 py-1.5 text-sm font-medium text-green-600 mb-8 cursor-default backdrop-blur-sm";
  const boxShadow = "0 1px 6px 0 rgba(0,0,0,0.04)";
  const badgeDotClasses = "relative flex h-2.5 w-2.5";
  const pingClasses = "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75";
  const dotClasses = "relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#17C87E] to-[#10B981]";
  const textClasses = "tracking-wide";

  return (
    <div className={badgeClasses} style={{ boxShadow }}>
      <span className={badgeDotClasses}>
        <span className={pingClasses} />
        <span className={dotClasses} />
      </span>
      <span className={textClasses}>Live on Celo</span>
    </div>
  )
}