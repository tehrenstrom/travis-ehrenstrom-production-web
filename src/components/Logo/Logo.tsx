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
    <span className={clsx('text-xs font-semibold leading-tight sm:text-sm md:text-base', className)}>
      Travis Ehrenstrom Band - TEB
    </span>
  )
}
