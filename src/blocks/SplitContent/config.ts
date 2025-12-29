import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const SplitContent: Block = {
  slug: 'splitContent',
  interfaceName: 'SplitContentBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
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
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'mediaLeft',
      options: [
        {
          label: 'Media Left',
          value: 'mediaLeft',
        },
        {
          label: 'Media Right',
          value: 'mediaRight',
        },
      ],
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'Primary Link',
      },
    }),
  ],
  labels: {
    plural: 'Split Content Blocks',
    singular: 'Split Content Block',
  },
}
