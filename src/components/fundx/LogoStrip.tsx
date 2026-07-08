import Image from "next/image"

interface LogoItemProps {
  name: string;
  size?: 'small' | 'large';
  hoverColor?: string;
}

function LogoItem({ name, size = 'small', hoverColor = '#fbe72b' }: LogoItemProps) {
  return (
    <div className="flex items-center justify-center h-12 cursor-default group">
      <span
        className={`text-${size === 'small' ? '3xl' : '4xl'} font-${size === 'small' ? 'bold' : 'black_'} tracking-${size === 'small' ? 'tight' : 'tighter'} text-slate-300 transition-colors duration-300 group-hover:text-${hoverColor}`}
      >
        {name}
      </span>
    </div>
  )
}

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20"> {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          
          <LogoItem name="Celo" />
          <LogoItem name="MiniPay" />
          <LogoItem name="cUSD" size="large" />
          <LogoItem name="USDC" size="large" hoverColor="#00b0f0" />
        
        </div>
      </div>
    </div>
  )
}