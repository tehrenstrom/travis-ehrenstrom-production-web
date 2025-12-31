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
      <div className={cn('flex flex-col items-center gap-1', className)}>
        <div className="flex items-center gap-3">
          <span className="ornament-star text-accent" />
          <span className="font-display text-2xl leading-none tracking-[0.1em] sm:text-3xl md:text-4xl">
            TEB
          </span>
          <span className="ornament-star text-accent" />
        </div>
        <div className="flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.35em] text-muted-foreground">
          <span className="h-px w-6 bg-current opacity-40" />
          <span>Travis Ehrenstrom Band</span>
          <span className="h-px w-6 bg-current opacity-40" />
        </div>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="ornament-diamond text-accent/60" />
        <span className="font-display text-xl leading-none tracking-[0.08em] sm:text-2xl">
          TEB
        </span>
        <span className="ornament-diamond text-accent/60" />
      </div>
    )
  }

  return (
    <span
      className={cn(
        'group relative inline-flex items-center gap-2 font-display text-xl leading-none tracking-[0.1em] transition-colors sm:text-2xl md:text-3xl',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1"
      />
      <span className="relative">
        <span className="relative z-10">TEB</span>
        {/* Subtle underline accent */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent/50 transition-transform duration-300 group-hover:scale-x-100"
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
      />
    </span>
  )
}
