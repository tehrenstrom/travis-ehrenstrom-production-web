import React from 'react'
import { Download } from 'lucide-react'

import type { FastFactsBlock as FastFactsBlockProps } from '@/payload-types'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

const downloadHref = (download: NonNullable<FastFactsBlockProps['downloads']>[0]): string | null => {
  if (download.file && typeof download.file === 'object' && download.file.url) {
    return download.file.url
  }
  return download.url || null
}

export const FastFactsBlock: React.FC<FastFactsBlockProps> = ({
  contactEmail,
  contactPhone,
  downloads,
  facts,
  heading,
}) => {
  const hasFacts = Boolean(facts?.length)
  const hasDownloads = Boolean(downloads?.length)
  const hasContact = Boolean(contactEmail || contactPhone)

  if (!hasFacts && !hasDownloads && !hasContact) return null

  return (
    <section className="container">
      <div className="max-w-3xl">
        {heading && (
          <h2 className="mb-8 font-display text-display-sm font-extrabold tracking-display md:text-display-md">
            {heading}
          </h2>
        )}

        {hasFacts && (
          <dl>
            {facts?.map((fact, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[12rem_1fr] sm:gap-6"
              >
                <dt className="font-mono text-2xs uppercase tracking-label text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="text-base text-card-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {hasDownloads && (
          <div className="mt-8 flex flex-wrap gap-3">
            {downloads?.map((download, i) => {
              const href = downloadHref(download)
              if (!href) return null

              return (
                <a
                  key={i}
                  className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'gap-2')}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Download className="h-4 w-4" />
                  {download.label}
                </a>
              )
            })}
          </div>
        )}

        {hasContact && (
          <p className="mt-8 font-mono text-sm text-muted-foreground">
            {contactEmail && (
              <a className="text-primary hover:underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            )}
            {contactEmail && contactPhone && <span className="mx-2">·</span>}
            {contactPhone && <span>{contactPhone}</span>}
          </p>
        )}
      </div>
    </section>
  )
}
