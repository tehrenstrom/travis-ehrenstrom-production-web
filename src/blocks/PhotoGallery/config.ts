import type { Block } from 'payload'

export const PhotoGallery: Block = {
  slug: 'photoGallery',
  interfaceName: 'PhotoGalleryBlock',
  labels: {
    singular: 'Photo Gallery',
    plural: 'Photo Galleries',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'selection',
      options: [
        { label: 'Manual Selection', value: 'selection' },
        { label: 'Press Photos (Auto)', value: 'pressPhotos' },
      ],
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
    {
      name: 'maxPhotos',
      type: 'number',
      defaultValue: 20,
      min: 1,
      max: 50,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'pressPhotos',
        description: 'Maximum number of press photos to display',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'scroll',
      options: [
        { label: 'Horizontal Scroll', value: 'scroll' },
        { label: 'Grid', value: 'grid' },
      ],
    },
  ],
}

