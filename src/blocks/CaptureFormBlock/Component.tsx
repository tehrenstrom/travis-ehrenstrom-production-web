import React from 'react'

import type { CaptureFormBlock as CaptureFormBlockProps } from '@/payload-types'

import { CaptureForm } from '@/components/CaptureForm'

export const CaptureFormBlockComponent: React.FC<CaptureFormBlockProps> = ({
  background,
  heading,
  intro,
  placement,
}) => {
  const form = (
    <CaptureForm
      heading={heading || 'Stay in the loop'}
      intro={intro || undefined}
      placement={placement || 'page'}
    />
  )

  if (background === 'sunset') {
    return (
      <section className="teb-sunset teb-grain py-16 md:py-24">
        <div className="container">{form}</div>
      </section>
    )
  }

  return <section className="container">{form}</section>
}
