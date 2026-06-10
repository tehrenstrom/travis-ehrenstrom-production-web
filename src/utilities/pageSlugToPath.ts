/**
 * Maps a pages-collection slug to its canonical frontend path.
 *
 * Page slugs are single-segment, but some pages render at nested URLs via
 * dedicated route files (e.g. src/app/(frontend)/booking/solo/page.tsx queries
 * the `booking-solo` page doc). Everything that derives a URL from a page slug
 * (revalidation, sitemap, live preview) must go through this map so those pages
 * revalidate and link correctly.
 */
export const NESTED_PAGE_PATHS: Record<string, string> = {
  'booking-solo': '/booking/solo',
  'booking-teb': '/booking/teb',
}

export const pageSlugToPath = (slug: null | string | undefined): string => {
  if (!slug || slug === 'home') return '/'
  return NESTED_PAGE_PATHS[slug] ?? `/${slug}`
}
