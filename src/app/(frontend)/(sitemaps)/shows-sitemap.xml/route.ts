import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'

const getShowsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'shows',
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
          .filter((show) => Boolean(show?.slug))
          .map((show) => ({
            loc: `${SITE_URL}/shows/${show?.slug}`,
            lastmod: show.updatedAt || dateFallback,
          }))
      : []
  },
  ['shows-sitemap'],
  {
    tags: ['shows-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getShowsSitemap()

  return getServerSideSitemap(sitemap)
}
