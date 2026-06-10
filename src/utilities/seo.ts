import { getServerSideURL } from './getURL'

const DEFAULT_SITE_NAME = 'Travis Ehrenstrom & TEB | Pacific Northwest Americana | Central Oregon'
const DEFAULT_DESCRIPTION =
  'Official site of Travis Ehrenstrom and the Travis Ehrenstrom Band (TEB) — Pacific Northwest Americana and jam-rock from Central Oregon. Tour dates, music, and news for both the solo and full-band shows.'
const DEFAULT_OG_IMAGE = '/teb-og.webp'

type MediaLike = {
  url?: string | null
  sizes?: {
    og?: {
      url?: string | null
    } | null
  } | null
} | null

export const getSiteName = () => process.env.NEXT_PUBLIC_SITE_NAME || DEFAULT_SITE_NAME

export const getDefaultDescription = () =>
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || DEFAULT_DESCRIPTION

export const getDefaultOgImage = () => {
  const serverUrl = getServerSideURL()
  const configured = process.env.NEXT_PUBLIC_OG_IMAGE
  const source = configured || DEFAULT_OG_IMAGE

  if (!source) return ''
  if (source.startsWith('http://') || source.startsWith('https://')) return source

  const normalized = source.startsWith('/') ? source : `/${source}`
  return `${serverUrl}${normalized}`
}

export const resolveMediaUrl = (image?: any) => {
  if (!image || typeof image !== 'object') return ''

  const media = image as MediaLike
  const serverUrl = getServerSideURL()
  const ogUrl = media?.sizes?.og?.url

  if (ogUrl) return `${serverUrl}${ogUrl}`
  if (media?.url) return `${serverUrl}${media.url}`

  return ''
}

export const buildCanonicalUrl = (path = '/') => {
  const serverUrl = getServerSideURL()

  if (!path) return serverUrl
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${serverUrl}${normalized}`
}

export const normalizeTwitterHandle = (handle?: string | null) => {
  if (!handle) return undefined
  return handle.startsWith('@') ? handle : `@${handle}`
}
