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
        <span className="font-display font-extrabold tracking-display text-2xl leading-none sm:text-3xl md:text-4xl">
          TEB
        </span>
        <span className="font-mono text-2xs tracking-label uppercase text-muted-foreground">
          Travis Ehrenstrom Band
        </span>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={cn(
          'font-display font-extrabold tracking-display text-xl leading-none sm:text-2xl',
          className,
        )}
      >
        TEB
      </span>
    )
  }

  // Default: clean wordmark with subtle hover
  return (
    <span
      className={cn(
        'font-display font-extrabold tracking-display text-xl leading-none transition-colors duration-200 sm:text-2xl md:text-3xl',
        'hover:text-primary',
        className,
      )}
    >
      TEB
    </span>
  )
}
