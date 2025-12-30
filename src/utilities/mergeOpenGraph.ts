import type { Metadata } from 'next'
import { getDefaultDescription, getDefaultOgImage, getSiteName } from './seo'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: getDefaultDescription(),
  images: [
    {
      url: getDefaultOgImage(),
    },
  ],
  siteName: getSiteName(),
  title: getSiteName(),
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
