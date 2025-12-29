import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const Announcement: Block = {
  slug: 'announcement',
  interfaceName: 'AnnouncementBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
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
      label: 'Content',
    },
    link({
      overrides: {
        name: 'link',
      },
    }),
  ],
  labels: {
    plural: 'Announcements',
    singular: 'Announcement',
  },
}
