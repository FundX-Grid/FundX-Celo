export const HERO_BADGE_CLASSES = 'inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-gradient-to-r from-green-50/50 to-white px-4 py-1.5 text-sm font-medium text-green-600 mb-8 cursor-default backdrop-blur-sm';
export const HERO_BADGE_BOX_SHADOW = '0 1px 6px 0 rgba(0,0,0,0.04)';
export const HERO_BADGE_PING_CLASSES = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75';
export const HERO_BADGE_CIRCLE_CLASSES = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#17C87E] to-[#10B981]';
export const HERO_BADGE_TEXT_CLASSES = 'tracking-wide';
export function HeroBadge() {
  return (
    <div className={HERO_BADGE_CLASSES} style={{ boxShadow: HERO_BADGE_BOX_SHADOW }}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={HERO_BADGE_PING_CLASSES} />
        <span className={HERO_BADGE_CIRCLE_CLASSES} />
      </span>
      <span className={HERO_BADGE_TEXT_CLASSES}>Live on Celo</span>
    </div>
  );
}