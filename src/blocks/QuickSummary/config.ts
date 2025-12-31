import type { Block } from 'payload'

export const QuickSummary: Block = {
  slug: 'quickSummary',
  interfaceName: 'QuickSummaryBlock',
  labels: {
    plural: 'Quick Summaries',
    singular: 'Quick Summary',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'At a Glance',
      admin: {
        description: 'Small label displayed above the title',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional heading for the summary block',
      },
    },
    {
      type: 'collapsible',
      label: 'Summary Items',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'who',
          type: 'text',
          label: 'Who',
          admin: {
            description: 'Artist/band identity (e.g., "Indie-folk multi-instrumentalist from Austin")',
          },
        },
        {
          name: 'what',
          type: 'text',
          label: 'What',
          admin: {
            description: 'What they do/create (e.g., "Original songs + genre-bending covers")',
          },
        },
        {
          name: 'where',
          type: 'text',
          label: 'Where',
          admin: {
            description: 'Location/base (e.g., "Central Texas & beyond")',
          },
        },
        {
          name: 'when',
          type: 'text',
          label: 'When',
          admin: {
            description: 'Timeline/era (e.g., "Active since 2015")',
          },
        },
        {
          name: 'why',
          type: 'text',
          label: 'Why',
          admin: {
            description: 'Mission/purpose (e.g., "Music that connects & moves")',
          },
        },
      ],
    },
  ],
}

