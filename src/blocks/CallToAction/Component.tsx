import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden rounded-[32px] border border-foreground/10 bg-card/80 p-6 shadow-[0_28px_70px_-48px_rgba(0,0,0,0.5)] backdrop-blur md:flex md:items-center md:justify-between md:gap-10 md:p-10">
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-[48rem]">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="relative mt-6 flex flex-col gap-4 md:mt-0 md:flex-row md:items-center">
          {(links || []).map(({ link }, i) => {
            const isPrimary = i === 0
            return (
              <CMSLink
                key={i}
                appearance={isPrimary ? 'default' : 'outline'}
                size="lg"
                {...link}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
