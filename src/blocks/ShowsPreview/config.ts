import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const ShowsPreview: Block = {
  slug: 'showsPreview',
  interfaceName: 'ShowsPreviewBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'introContent',
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
      label: 'Intro Content',
    },
    {
      name: 'project',
      type: 'select',
      defaultValue: 'all',
      options: [
        {
          label: 'All',
          value: 'all',
        },
        {
          label: 'Travis Ehrenstrom (Solo)',
          value: 'travis',
        },
        {
          label: 'TEB (Band)',
          value: 'teb',
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
    },
    {
      name: 'includePast',
      type: 'checkbox',
      label: 'Include Past Shows',
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'Primary Link',
      },
    }),
  ],
  labels: {
    plural: 'Shows Previews',
    singular: 'Shows Preview',
  },
}
