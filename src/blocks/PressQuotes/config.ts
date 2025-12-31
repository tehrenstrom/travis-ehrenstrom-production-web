import type { Block } from 'payload'

export const PressQuotes: Block = {
  slug: 'pressQuotes',
  interfaceName: 'PressQuotesBlock',
  labels: {
    singular: 'Press Quotes',
    plural: 'Press Quotes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Press',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'quotes',
      type: 'array',
      label: 'Quotes',
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'attribution',
          type: 'text',
          label: 'Author/Reviewer',
        },
        {
          name: 'source',
          type: 'text',
          label: 'Publication/Source',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
        },
      ],
    },
    {
      name: 'recentPress',
      type: 'array',
      label: 'Recent Press Links',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

