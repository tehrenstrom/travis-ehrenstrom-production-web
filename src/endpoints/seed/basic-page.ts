import type { RequiredDataFromCollectionSlug } from 'payload'
import type { ContentBlock } from '@/payload-types'

type BasicPageArgs = {
  slug: string
  title: string
  heading?: string
  body?: string
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

const buildRichText = (
  heading: string,
  body: string,
): NonNullable<ContentBlock['columns']>[number]['richText'] => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'heading',
        children: [textNode(heading)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h2',
        version: 1,
      },
      {
        type: 'paragraph',
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

export const basicPage = ({
  slug,
  title,
  heading = title,
  body = 'Update this page in the admin to add your content.',
}: BasicPageArgs): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    slug,
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockName: `${title} Content`,
        blockType: 'content',
        columns: [
          {
            richText: buildRichText(heading, body),
            size: 'full',
          },
        ],
      },
    ],
    title,
  }
}
