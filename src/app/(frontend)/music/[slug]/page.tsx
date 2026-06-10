import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import { ReleaseDetailClient } from '@/components/ReleaseDetailClient'
import { getMediaUrl } from '@/utilities/getMediaUrl'

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

  const coverArt =
    release.coverArt && typeof release.coverArt === 'object' ? release.coverArt : null
  const coverUrl = coverArt?.url ? getMediaUrl(coverArt.url, coverArt.updatedAt) : ''

  const tracklist =
    release.tracklist?.map((track, index) => ({
      title: track.title,
      duration: track.duration,
      trackNum: track.bandcampTrackNum ?? index + 1,
    })) || []

  const links =
    release.links
      ?.filter((link) => Boolean(link?.url && link?.label))
      .map((link) => ({ label: link.label, url: link.url })) || []

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={release} type="MusicAlbum" />

      <section className="container">
        <ReleaseDetailClient
          releaseId={String(release.id)}
          title={release.title}
          coverUrl={coverUrl}
          coverAlt={coverArt?.alt || release.title}
          dateLabel={dateLabel}
          project={release.project ?? null}
          isLive={release.isLive ?? null}
          bandcampId={release.bandcampId ?? null}
          links={links}
          tracklist={tracklist}
        />
      </section>

      {/* Description */}
      {release.description && (
        <section className="container mt-16 max-w-2xl">
          <div className="prose dark:prose-invert max-w-none">
            <RichText data={release.description} />
          </div>
        </section>
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
