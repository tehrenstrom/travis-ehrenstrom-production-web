import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function MusicPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const page = await queryPageBySlug({ draft, slug: 'music' })

  const releases = await payload.find({
    collection: 'releases',
    depth: 1,
    draft,
    limit: 200,
    overrideAccess: draft,
    sort: '-releaseDate',
  })

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  })

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/music" />

      {draft && <LivePreviewListener />}

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      <div className="container mt-12">
        {!page?.hero && (
          <div className="prose dark:prose-invert max-w-none">
            <h1>Music</h1>
          </div>
        )}
      </div>

      <section className="container mt-8">
        {releases.docs.length === 0 && <p>No releases yet.</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {releases.docs.map((release) => {
            const dateLabel = release.releaseDate
              ? formatter.format(new Date(release.releaseDate))
              : ''
            const links =
              release.links?.filter((link) => Boolean(link?.url && link?.label)) ?? []
            return (
              <article className="border border-border rounded-lg overflow-hidden" key={release.id}>
                {release.coverArt && typeof release.coverArt !== 'string' && (
                  <div className="relative aspect-square w-full">
                    <Media fill imgClassName="object-cover" resource={release.coverArt} />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">
                    {dateLabel}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold">
                    <Link href={`/music/${release.slug}`}>{release.title}</Link>
                  </h3>
                  {links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {links.map((link, index) => (
                        <a
                          className="underline"
                          href={link?.url as string}
                          key={`${release.id}-${index}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link?.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </article>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Music',
  }
}

const queryPageBySlug = cache(
  async ({ draft, slug }: { draft: boolean; slug: string }): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
