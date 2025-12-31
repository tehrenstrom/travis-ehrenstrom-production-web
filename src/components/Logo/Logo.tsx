import { cn } from '@/utilities/ui'
import React from 'react'
import { SunIcon, FlowerIcon, DiamondIcon, MountainIcon } from '@/components/icons/HandDrawnIcons'

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
          <MountainIcon size="md" className="text-accent" />
          <span className="font-display text-2xl leading-none sm:text-3xl md:text-4xl">
            TEB
          </span>
          <MountainIcon size="md" className="text-accent" />
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
        <DiamondIcon size="sm" className="text-accent/70" />
        <span className="font-display text-xl leading-none sm:text-2xl">
          TEB
        </span>
        <DiamondIcon size="sm" className="text-accent/70" />
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
      <FlowerIcon
        size="sm"
        className="text-accent/0 transition-all duration-300 group-hover:text-accent/80"
      />
      <span className="relative">TEB</span>
      <FlowerIcon
        size="sm"
        className="text-accent/0 transition-all duration-300 group-hover:text-accent/80"
      />
    </span>
  )
}
