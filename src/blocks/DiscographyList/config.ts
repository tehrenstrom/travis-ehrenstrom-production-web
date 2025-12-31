import type { Block } from 'payload'

export const DiscographyList: Block = {
  slug: 'discographyList',
  interfaceName: 'DiscographyListBlock',
  labels: {
    singular: 'Discography List',
    plural: 'Discography Lists',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Discography',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'From Releases Collection', value: 'collection' },
      ],
    },
    {
      name: 'releases',
      type: 'array',
      label: 'Releases',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'manual',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
        },
      ],
    },
    {
      name: 'maxReleases',
      type: 'number',
      defaultValue: 20,
      min: 1,
      max: 50,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        description: 'Maximum number of releases to display',
      },
    },
    {
      name: 'showLink',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show link to full music page',
    },
  ],
}

