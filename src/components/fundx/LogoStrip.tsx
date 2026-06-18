import Image from "next/image"

interface LogoItemProps {
  name: string;
  textSize?: '3xl' | '4xl';
  textColor?: string;
}

const LogoItem = ({ name, textSize = '3xl', textColor = '#fbe72b' }: LogoItemProps) => {
  return (
    <div className="flex items-center justify-center h-12 cursor-default group">
      <span className={`text-${textSize} font-${textSize === '3xl' ? 'bold' : 'black_'} tracking-${textSize === '3xl' ? 'tight' : 'tighter'} text-slate-300 transition-colors duration-300 group-hover:text-[${textColor}]`}>{name}</span>
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
          <LogoItem name="cUSD" textSize="4xl" />
          <LogoItem name="USDC" textSize="4xl" textColor="#3498db" />
        </div>
      </div>
    </div>
  );
}
