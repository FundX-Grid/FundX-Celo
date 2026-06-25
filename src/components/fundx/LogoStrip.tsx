import Image from "next/image"

const logos = [
  { name: 'Celo', color: '#fbe72b', size: 'text-3xl', fontWeight: 'font-bold' },
  { name: 'MiniPay', color: '#fbe72b', size: 'text-3xl', fontWeight: 'font-bold' },
  { name: 'cUSD', color: '#fbe72b', size: 'text-4xl', fontWeight: 'font-black_' },
  { name: 'USDC', color: 'blue-500', size: 'text-4xl', fontWeight: 'font-black_' },
]

const LogoItem = ({ name, color, size, fontWeight }) => (
  <div className="flex items-center justify-center h-12 cursor-default group">
    <span className={`${size} ${fontWeight} tracking-tighter text-slate-300 transition-colors duration-300 group-hover:text-${color}`}>{name}</span>
  </div>
)

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          {logos.map((logo) => (
            <LogoItem key={logo.name} name={logo.name} color={logo.color} size={logo.size} fontWeight={logo.fontWeight} />
          ))}
        </div>
      </div>
    </div>
  )
}