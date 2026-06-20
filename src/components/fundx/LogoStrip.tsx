import Image from "next/image"

const logoItems = [
  { name: 'Celo', color: '#fbe72b' },
  { name: 'MiniPay', color: '#fbe72b' },
  { name: 'cUSD', color: '#fbe72b' },
  { name: 'USDC', color: '#blue-500' },
]

const LogoItem = ({ name, color, fontSize = '3xl', fontWeight = 'font-bold' }) => (
  <div className="flex items-center justify-center h-12 cursor-default group">
    <span className={`${fontSize} ${fontWeight} tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-[${color}]`}>{name}</span>
  </div>
)

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-32 w-full">
          {logoItems.map((item, index) => (
            <LogoItem key={index} name={item.name} color={item.color} fontSize={index === 2 || index === 3 ? '4xl' : '3xl'} fontWeight={index === 2 || index === 3 ? 'font-black_' : 'font-bold'} />
          ))}
        </div>
      </div>
    </div>
  )
}