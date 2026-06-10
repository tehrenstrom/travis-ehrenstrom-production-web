import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border-l-stamp py-3 px-6 flex items-center rounded-md', {
          'border-l-denim-400 bg-denim-500/10': style === 'info',
          'border-l-error bg-error/10': style === 'error',
          'border-l-success bg-success/10': style === 'success',
          'border-l-warning bg-warning/10': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
