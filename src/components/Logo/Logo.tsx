import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      className={clsx(
        'font-display text-xs font-semibold leading-tight tracking-[0.02em] sm:text-sm md:text-base',
        className,
      )}
    >
      Travis Ehrenstrom Band - TEB
    </span>
  )
}
