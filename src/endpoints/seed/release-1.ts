import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type ReleaseArgs = {
  coverArt: Media
}

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const buildParagraph = (body: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [textNode(body)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const release1: (args: ReleaseArgs) => RequiredDataFromCollectionSlug<'releases'> = ({
  coverArt,
}) => {
  return {
    _status: 'published',
    title: 'Hollinshead EP',
    slug: 'hollinshead-ep',
    releaseDate: '2024-08-01T00:00:00.000Z',
    project: 'teb',
    coverArt: coverArt.id,
    description: buildParagraph(
      'A five-song EP capturing the full-band energy of TEB with folk-driven hooks and fusion grooves.',
    ),
    tracklist: [
      { title: 'Hollinshead' },
      { title: 'Open Road' },
      { title: 'Firelight' },
      { title: 'Slow Motion' },
      { title: 'Bend in the River' },
    ],
    links: [
      {
        label: 'Listen on Spotify',
        url: 'https://open.spotify.com/',
      },
      {
        label: 'Bandcamp',
        url: 'https://bandcamp.com/',
      },
    ],
  }
}
