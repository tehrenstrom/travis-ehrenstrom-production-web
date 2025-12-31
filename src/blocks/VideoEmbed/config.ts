import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Video',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'videos',
      type: 'array',
      label: 'YouTube Videos',
      minRows: 1,
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          required: true,
          label: 'YouTube Video ID',
          admin: {
            description: 'The ID from the YouTube URL (e.g., "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ)',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Video Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured (Large + Thumbnails)', value: 'featured' },
        { label: 'Grid', value: 'grid' },
      ],
    },
  ],
}

