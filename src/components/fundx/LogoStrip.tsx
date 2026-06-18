import Image from "next/image";

const logos = [
  { name: 'Celo', size: 'text-3xl', color: '#fbe72b' },
  { name: 'MiniPay', size: 'text-3xl', color: '#fbe72b' },
  { name: 'cUSD', size: 'text-4xl', color: '#fbe72b' },
  { name: 'USDC', size: 'text-4xl', color: '#blue-500' },
];

const LogoItem = ({ name, size, color }) => (
  <div className="flex items-center justify-center h-12 cursor-default group">
    <span className={`${size} font-bold tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-[${color}]`}>{name}</span>
  </div>
);

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          {logos.map((logo) => (
            <LogoItem key={logo.name} name={logo.name} size={logo.size} color={logo.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
