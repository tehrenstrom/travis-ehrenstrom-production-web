import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'default' | 'wordmark' | 'full'
}

export const Logo = (props: Props) => {
  const { className, variant = 'default' } = props

  if (variant === 'full') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="flex items-center gap-3">
          <span className="text-accent text-lg">☼</span>
          <span className="font-display text-2xl leading-none sm:text-3xl md:text-4xl">
            TEB
          </span>
          <span className="text-accent text-lg">☼</span>
        </div>
        <div className="flex items-center gap-2 text-xs tracking-wide text-muted-foreground">
          <span>Travis Ehrenstrom Band</span>
        </div>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-accent/70 text-sm">✦</span>
        <span className="font-display text-xl leading-none sm:text-2xl">
          TEB
        </span>
        <span className="text-accent/70 text-sm">✦</span>
      </div>
    )
  }

  return (
    <span
      className={cn(
        'group relative inline-flex items-center gap-2 font-display text-xl leading-none transition-all duration-300 sm:text-2xl md:text-3xl',
        'hover:text-accent',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-accent/0 transition-all duration-300 group-hover:text-accent/80 text-sm"
      >
        ✿
      </span>
      <span className="relative">TEB</span>
      <span
        aria-hidden="true"
        className="text-accent/0 transition-all duration-300 group-hover:text-accent/80 text-sm"
      >
        ✿
      </span>
    </span>
  )
}
