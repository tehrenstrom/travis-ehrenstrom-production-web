import type { Page, Post, Product, Release, Show, Media } from '../payload-types'
import { getSiteName, getDefaultDescription, buildCanonicalUrl } from './seo'
import { getServerSideURL } from './getURL'

export type SchemaType = 'Event' | 'MusicAlbum' | 'Product' | 'BlogPosting' | 'MusicGroup' | 'WebSite'

export function generateStructuredData(doc: any, type?: SchemaType): any {
  const siteName = getSiteName()
  const serverUrl = getServerSideURL()

  // Default WebSite Schema
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: serverUrl,
  }

  if (!doc) return baseSchema

  if (type === 'Event' || ('date' in doc && 'venue' in doc)) {
    const show = doc as Show
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: show.title,
      startDate: show.date,
      endDate: show.endDate || show.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: show.venue,
        address: {
          '@type': 'PostalAddress',
          addressLocality: show.location?.city,
          addressRegion: show.location?.region,
          addressCountry: show.location?.country,
        },
      },
      image: typeof show.flyer === 'object' ? `${serverUrl}${show.flyer?.url}` : undefined,
      description: show.meta?.description || getDefaultDescription(),
      offers: show.ticketUrl
        ? {
            '@type': 'Offer',
            url: show.ticketUrl,
            availability: 'https://schema.org/InStock',
          }
        : undefined,
      performer: {
        '@type': 'MusicGroup',
        name: show.project === 'teb' ? 'Travis Ehrenstrom Band' : 'Travis Ehrenstrom',
      },
    }
  }

  if (type === 'MusicAlbum' || 'releaseDate' in doc) {
    const release = doc as Release
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicAlbum',
      name: release.title,
      datePublished: release.releaseDate,
      image: typeof release.coverArt === 'object' ? `${serverUrl}${release.coverArt?.url}` : undefined,
      byArtist: {
        '@type': 'MusicGroup',
        name: release.project === 'teb' ? 'Travis Ehrenstrom Band' : 'Travis Ehrenstrom',
      },
      numTracks: release.tracklist?.length,
      track: release.tracklist?.map((track, index) => ({
        '@type': 'MusicRecording',
        name: track.title,
        position: index + 1,
        duration: track.duration,
      })),
    }
  }

  if (type === 'Product' || 'price' in doc) {
    const product = doc as Product
    const firstImage = product.images?.[0]
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: typeof firstImage === 'object' ? `${serverUrl}${firstImage.url}` : undefined,
      description: product.meta?.description || getDefaultDescription(),
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        url: buildCanonicalUrl(`/store/${product.slug}`),
        availability: 'https://schema.org/InStock',
      },
    }
  }

  if (type === 'BlogPosting' || ('content' in doc && 'authors' in doc)) {
    const post = doc as Post
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      image: typeof post.meta?.image === 'object' ? `${serverUrl}${post.meta?.image?.url}` : undefined,
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      author: post.populatedAuthors?.map((author) => ({
        '@type': 'Person',
        name: author.name,
      })),
    }
  }

  if (type === 'MusicGroup') {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      name: siteName,
      description: getDefaultDescription(),
      url: serverUrl,
      genre: ['Americana', 'Jam Band', 'Rock'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bend',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
    }
  }

  return baseSchema
}

