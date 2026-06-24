import Image from "next/image";

interface LogoProps {
  name: string;
  textSize?: string;
  hoverColor?: string;
}

const Logo = ({ name, textSize = 'text-3xl', hoverColor = '#fbe72b' }: LogoProps) => {
  return (
    <div className="flex items-center justify-center h-12 cursor-default group">
      <span className={`${textSize} font-bold tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-[${hoverColor}]`}>{name}</span>
    </div>
  );
};

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          <Logo name="Celo" />
          <Logo name="MiniPay" />
          <Logo name="cUSD" textSize="text-4xl" />
          <Logo name="USDC" textSize="text-4xl" hoverColor="#3498db" />
        </div>
      </div>
    </div>
  );
}