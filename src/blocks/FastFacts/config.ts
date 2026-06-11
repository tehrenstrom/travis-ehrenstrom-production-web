import type { Block } from 'payload'

/**
 * Press-kit fast facts: mono label/value rows (format, genre, draw, tech…),
 * optional downloads (one-sheet, stage plot, photos) and a booking contact
 * line. Rows Travis doesn't have numbers for yet are simply omitted — empty
 * sections render nothing.
 */
export const FastFacts: Block = {
  slug: 'fastFacts',
  interfaceName: 'FastFactsBlock',
  labels: {
    plural: 'Fast Facts',
    singular: 'Fast Facts',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Fast facts',
    },
    {
      name: 'facts',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'downloads',
      type: 'array',
      admin: {
        description: 'One-sheet, stage plot, press photos… Upload a file or paste a URL.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Used if no file is uploaded',
          },
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'text',
    },
  ],
}
