import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const FeaturedRelease: Block = {
  slug: 'featuredRelease',
  interfaceName: 'FeaturedReleaseBlock',
  fields: [
    {
      name: 'release',
      type: 'relationship',
      relationTo: 'releases',
    },
    {
      name: 'overrideTitle',
      type: 'text',
      label: 'Override Title',
    },
    {
      name: 'overrideDescription',
      type: 'richText',
      label: 'Override Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Override Cover',
    },
    {
      name: 'embedUrl',
      type: 'text',
      label: 'Embed URL',
      admin: {
        description: 'Paste a Spotify/Bandcamp/YouTube embed URL if you want a player.',
      },
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'Primary Link',
      },
    }),
  ],
  labels: {
    plural: 'Featured Releases',
    singular: 'Featured Release',
  },
}
