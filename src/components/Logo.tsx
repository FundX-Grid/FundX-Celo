import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo.svg"
      alt="FundX Logo"
      width={32}
      height={16}
      className={className}
    />
  );
}

// ⟳ echo · src/components/fundx/hero/HeroHeadline.tsx
//   return (
//     <h1 className="text-6xl md:text-7xl lg:text-8xl font_-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
//       Capital Formation
//       <br />