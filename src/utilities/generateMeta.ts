import type { Metadata } from 'next'

import type { Page, Post, Product, Release, Show } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import {
  buildCanonicalUrl,
  getDefaultDescription,
  getDefaultOgImage,
  getSiteName,
  resolveMediaUrl,
} from './seo'

export const generateMeta = async (args: {
  doc: Partial<Page | Post | Show | Release | Product> | null
  fallbackDescription?: string
  fallbackTitle?: string
  path?: string
}): Promise<Metadata> => {
  const { doc, fallbackDescription, fallbackTitle, path } = args
  const siteName = getSiteName()

  let canonicalPath = path
  if (!canonicalPath && doc?.slug) {
    if (doc.slug === 'home') {
      canonicalPath = '/'
    } else {
      // Determine collection prefix
      const isPost = 'content' in doc && !('releaseDate' in doc) && !('date' in doc)
      const isShow = 'date' in doc
      const isRelease = 'releaseDate' in doc
      const isProduct = 'price' in doc

      if (isPost) canonicalPath = `/posts/${doc.slug}`
      else if (isShow) canonicalPath = `/shows/${doc.slug}`
      else if (isRelease) canonicalPath = `/music/${doc.slug}`
      else if (isProduct) canonicalPath = `/store/${doc.slug}`
      else canonicalPath = `/${doc.slug}`
    }
  }

  const title = doc?.meta?.title || doc?.title || fallbackTitle || siteName

  const isHome = doc?.slug === 'home' || canonicalPath === '/' || path === '/'
  let finalTitle: Metadata['title'] = title

  if (isHome) {
    // For home page, use the full site name (which includes keywords) as the absolute title
    finalTitle = { absolute: siteName }
  } else if (title === siteName) {
    // If title is already siteName, let the template handle it or keep as is
    finalTitle = title
  }

  const description = doc?.meta?.description || fallbackDescription || getDefaultDescription()
  const imageUrl = resolveMediaUrl(doc?.meta?.image) || getDefaultOgImage()
  const canonicalUrl = buildCanonicalUrl(canonicalPath || '/')

  return {
    title: finalTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
            },
          ]
        : undefined,
      title: typeof finalTitle === 'string' ? finalTitle : finalTitle.absolute,
      url: canonicalUrl,
    }),
    twitter: {
      title: typeof finalTitle === 'string' ? finalTitle : finalTitle.absolute,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}
