import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import { cn } from '@/utilities/ui'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const releases = await payload.find({
    collection: 'releases',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return releases.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ReleasePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/music/' + decodedSlug
  const release = await queryReleaseBySlug({ draft, slug: decodedSlug })

  if (!release) return <PayloadRedirects url={url} />

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  })
  const dateLabel = release.releaseDate ? formatter.format(new Date(release.releaseDate)) : ''
  const bandcampEmbedUrl = release.bandcampId
    ? `https://bandcamp.com/EmbeddedPlayer/album=${release.bandcampId}/size=large/bgcol=111111/linkcol=faf5ed/tracklist=true/transparent=true/`
    : ''

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={release} type="MusicAlbum" />

      <div className="container">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{release.title}</h1>
        </div>
        {dateLabel && <p className="mt-2 text-muted-foreground">Released {dateLabel}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {bandcampEmbedUrl && (
            <a className={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'gap-2')} href="#player">
              Play
            </a>
          )}
          {release.links
            ?.filter((link) => Boolean(link?.url && link?.label))
            .map((link, index) => (
              <a
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
                href={link?.url as string}
                key={`${release.id}-${index}`}
                rel="noreferrer"
                target="_blank"
              >
                {link?.label}
              </a>
            ))}
        </div>
      </div>

      {bandcampEmbedUrl && (
        <section className="container mt-10" id="player">
          <div className="vintage-card p-4">
            <div className="flex items-center justify-between text-label-sm uppercase tracking-stamp text-muted-foreground mb-3">
              <span>Bandcamp Player</span>
              <span>Play on site</span>
            </div>
            <iframe
              className="w-full h-[120px] border-0"
              loading="lazy"
              src={bandcampEmbedUrl}
              title={`${release.title} Bandcamp player`}
            />
          </div>
        </section>
      )}

      {release.coverArt && typeof release.coverArt !== 'string' && (
        <div className="container mt-10">
          <Media resource={release.coverArt} />
        </div>
      )}

      {release.description && (
        <div className="container mt-10">
          <RichText data={release.description} />
        </div>
      )}

      {release.tracklist && release.tracklist.length > 0 && (
        <div className="container mt-10">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Tracklist</h2>
          </div>
          <ol className="mt-4 space-y-2">
            {release.tracklist.map((track, index) => (
              <li className="flex items-center justify-between" key={`${release.id}-${index}`}>
                <span>
                  {index + 1}. {track.title}
                </span>
                {track.duration && <span className="text-sm text-muted-foreground">{track.duration}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const release = await queryReleaseBySlug({ draft: false, slug: decodedSlug })

  return generateMeta({ doc: release })
}

const queryReleaseBySlug = cache(async ({ draft, slug }: { draft: boolean; slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'releases',
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
})
