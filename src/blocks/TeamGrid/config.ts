import type { Block } from 'payload'

export const TeamGrid: Block = {
  slug: 'teamGrid',
  interfaceName: 'TeamGridBlock',
  labels: {
    singular: 'Team Grid',
    plural: 'Team Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'The Band',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'members',
      type: 'array',
      label: 'Band Members',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role/Instrument',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'hometown',
          type: 'text',
          label: 'Hometown',
          admin: {
            description: 'For baseball card layout (e.g., "Austin, TX")',
            condition: (_, siblingData, { blockData }) => blockData?.layout === 'baseballCards',
          },
        },
        {
          name: 'yearsActive',
          type: 'text',
          label: 'Years Active',
          admin: {
            description: 'e.g., "2015–Present" or "8 seasons"',
            condition: (_, siblingData, { blockData }) => blockData?.layout === 'baseballCards',
          },
        },
        {
          name: 'funFact',
          type: 'text',
          label: 'Fun Fact / Signature Stat',
          admin: {
            description: 'A quirky fact or notable stat',
            condition: (_, siblingData, { blockData }) => blockData?.layout === 'baseballCards',
          },
        },
        {
          name: 'number',
          type: 'text',
          label: 'Jersey Number',
          admin: {
            description: 'Optional number for the card (e.g., "01")',
            condition: (_, siblingData, { blockData }) => blockData?.layout === 'baseballCards',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'Simple List', value: 'list' },
        { label: 'Cards with Photos', value: 'cards' },
        { label: 'Baseball Cards', value: 'baseballCards' },
      ],
    },
  ],
}

