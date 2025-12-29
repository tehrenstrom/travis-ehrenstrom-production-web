import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { slugField } from 'payload'
import { revalidateDelete, revalidateShow } from './Shows/hooks/revalidateShow'

export const Shows: CollectionConfig<'shows'> = {
  slug: 'shows',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'date', 'venue', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'shows',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'shows',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'project',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: [
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
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'venue',
      type: 'text',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'region',
          type: 'text',
          label: 'State / Region',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Ticket URL',
    },
    {
      name: 'flyer',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'details',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateShow],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
