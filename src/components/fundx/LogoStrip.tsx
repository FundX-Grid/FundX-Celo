import Image from "next/image"

const LogoItem = ({ name, hoverColor = '#fbe72b', textSize = '3xl', fontWeight = 'font-bold' }) => {
  return (
    <div className="flex items-center justify-center h-12 cursor-default group">
      <span className={`text-${textSize} ${fontWeight} tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-${hoverColor}`}>{name}</span>
    </div>
  )
}

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          <LogoItem name="Celo" />
          <LogoItem name="MiniPay" />
          <LogoItem name="cUSD" textSize="4xl" fontWeight="font-black_" />
          <LogoItem name="USDC" textSize="4xl" fontWeight="font-black_" hoverColor="blue-500" />
        </div>
      </div>
    </div>
  )
}