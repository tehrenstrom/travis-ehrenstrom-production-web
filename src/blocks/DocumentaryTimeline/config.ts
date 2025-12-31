import type { Block } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

export const DocumentaryTimeline: Block = {
  slug: 'documentaryTimeline',
  interfaceName: 'DocumentaryTimelineBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Documentary Timeline',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'timeline',
      type: 'array',
      minRows: 1,
      labels: {
        plural: 'Chapters',
        singular: 'Chapter',
      },
      fields: [
        {
          name: 'period',
          type: 'text',
          label: 'Year / Range',
          required: true,
        },
        {
          name: 'chapter',
          type: 'text',
          label: 'Chapter Title',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Episode Tagline',
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'release',
          type: 'text',
          label: 'Key Release',
        },
        {
          name: 'summary',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
            },
          }),
          required: true,
        },
        {
          name: 'highlights',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'quote',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Quote Text',
            },
            {
              name: 'attribution',
              type: 'text',
              label: 'Attribution',
            },
          ],
        },
        {
          name: 'accent',
          type: 'select',
          defaultValue: 'ember',
          options: [
            {
              label: 'Ember',
              value: 'ember',
            },
            {
              label: 'Sage',
              value: 'sage',
            },
            {
              label: 'Coast',
              value: 'coast',
            },
            {
              label: 'Sunrise',
              value: 'sunrise',
            },
            {
              label: 'Midnight',
              value: 'midnight',
            },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Add a link/button',
          defaultValue: false,
        },
        link({
          appearances: ['default', 'outline'],
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.enableLink,
            },
          },
        }),
      ],
    },
  ],
  labels: {
    plural: 'Documentary Timelines',
    singular: 'Documentary Timeline',
  },
}
