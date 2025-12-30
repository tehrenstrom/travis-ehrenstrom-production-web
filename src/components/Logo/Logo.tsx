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
        'font-display text-lg font-semibold leading-none tracking-[0.08em] sm:text-xl md:text-2xl',
        className,
      )}
    >
      TEB
    </span>
  )
}
