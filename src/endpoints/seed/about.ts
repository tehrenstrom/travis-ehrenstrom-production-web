import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type AboutArgs = {
  portrait: Media
}

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const buildRichText = (heading: string, body: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'heading',
        children: [textNode(heading)],
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'h3',
        version: 1,
      },
      {
        type: 'paragraph',
        children: [textNode(body)],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const buildParagraph = (body: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [textNode(body)],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

export const about: (args: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  portrait,
}) => {
  return {
    slug: 'about',
    _status: 'published',
    title: 'About',
    hero: {
      type: 'lowImpact',
      richText: buildParagraph('About Travis Ehrenstrom and TEB.'),
    },
    layout: [
      {
        blockType: 'splitContent',
        heading: 'Travis Ehrenstrom + TEB',
        content: buildParagraph(
          'Travis Ehrenstrom is a Bend, OR-based songwriter with folk roots and a rock-forward edge. TEB expands the sound with a full-band, groove-driven live show.',
        ),
        media: portrait.id,
        layout: 'mediaLeft',
        ctaLink: {
          type: 'custom',
          label: 'Press kit (coming soon)',
          url: '#',
          appearance: 'outline',
        },
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'half',
            richText: buildRichText('Highlights', 'Festival appearances, touring, and standout releases.'),
          },
          {
            size: 'half',
            richText: buildRichText(
              'Sound',
              'Folk storytelling meets fusion-rock grooves and soulful hooks.',
            ),
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(
              'Band Members',
              'Travis Ehrenstrom (vocals/guitar), Patrick Pearsall (bass), and collaborators across the TEB collective.',
            ),
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(
              'Press',
              '“Ehrenstrom’s songwriting is a through line, threading heartfelt stories with rich musicianship.” — Press quote here',
            ),
          },
        ],
      },
    ],
  }
}
