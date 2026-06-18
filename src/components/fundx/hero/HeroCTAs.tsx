"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const buttonStyles = (variant: 'filled' | 'outline') => ({
  className: `h-16 px-10 rounded-full text-lg ${variant === 'filled' ? 'bg-slate-900 text-white font-bold' : 'border-2 border-slate-200 bg-white text-slate-700'}`,
  style: {
    boxShadow: variant === 'filled' ? '0 4px 20px 0 rgba(251, 231, 43, 0.3)' : undefined,
  },
})

const hoverStyles = (variant: 'filled' | 'outline') => ({
  hover: {
    backgroundColor: variant === 'filled' ? '#fbe72b' : '#fbe72b',
    color: variant === 'filled' ? 'rgb(46 64 74)' : 'rgb(46 64 74)',
    borderColor: variant === 'outline' ? '#fbe72b' : undefined,
  },
})

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/create">
        <Button size="lg" {...buttonStyles('filled')} {...hoverStyles('filled')}
          transition="all 250ms ease-in-out" hoverScale="1.025" activeScale="0.975"
        >
          Start a Campaign
        </Button>
      </Link>
      <Link href="/explore">
        <Button variant="outline" size="lg" {...buttonStyles('outline')} {...hoverStyles('outline')}
          transition="all 250ms ease-in-out" hoverScale="1.025" activeScale="0.975"
        >
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}