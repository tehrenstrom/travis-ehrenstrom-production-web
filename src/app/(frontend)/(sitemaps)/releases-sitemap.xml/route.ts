import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'

const getReleasesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'releases',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    return results.docs
      ? results.docs
          .filter((release) => Boolean(release?.slug))
          .map((release) => ({
            loc: `${SITE_URL}/music/${release?.slug}`,
            lastmod: release.updatedAt || dateFallback,
          }))
      : []
  },
  ['releases-sitemap'],
  {
    tags: ['releases-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getReleasesSitemap()

  return getServerSideSitemap(sitemap)
}
