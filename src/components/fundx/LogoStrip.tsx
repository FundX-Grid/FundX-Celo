import Image from "next/image"

interface LogoItemProps {
  name: string;
  size?: 'normal' | 'large';
  color?: string;
}

const LogoItem = ({ name, size = 'normal', color = '#fbe72b' }: LogoItemProps) => {
  const textSize = size === 'normal' ? 'text-3xl' : 'text-4xl';
  const font = size === 'normal' ? 'font-bold' : 'font-black_';
  const tracking = size === 'normal' ? 'tracking-tight' : 'tracking-tighter';

  return (
    <div className="flex items-center justify-center h-12 cursor-default group">
      <span className={`${textSize} ${font} ${tracking} text-slate-300 transition-colors duration-300 group-hover:text-[${color}]`}>{name}</span>
    </div>
  );
};

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          <LogoItem name="Celo" />
          <LogoItem name="MiniPay" />
          <LogoItem name="cUSD" size="large" />
          <LogoItem name="USDC" size="large" color="#3498db" />
        </div>
      </div>
    </div>
  );
}