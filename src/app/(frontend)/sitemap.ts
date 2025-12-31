import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = getServerSideURL()

  // This serves as the sitemap index pointing to all dynamic sitemaps
  // Next.js automatically generates the sitemap index if you return multiple entries or handle it via robots.ts
  // However, for a proper index, we want to ensure robots.ts points to the correct locations.
  
  // Since we are using dynamic sitemaps in (sitemaps) directory like /pages-sitemap.xml/route.ts,
  // those are already accessible.
  
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
