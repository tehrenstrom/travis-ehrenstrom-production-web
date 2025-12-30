import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { about } from './about'
import { basicPage } from './basic-page'
import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { newsletterForm as newsletterFormData } from './newsletter-form'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { release1 } from './release-1'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'shows',
  'releases',
  'products',
  'forms',
  'form-submissions',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding releases and shows...`)

  const featuredRelease = await payload.create({
    collection: 'releases',
    depth: 0,
    data: release1({ coverArt: image1Doc }),
  })

  const now = Date.now()
  await Promise.all([
    payload.create({
      collection: 'shows',
      draft: false,
      depth: 0,
      data: {
        _status: 'published',
        title: 'TEB Live at The Suttle Lodge',
        slug: 'teb-live-at-the-suttle-lodge',
        date: new Date(now + 1000 * 60 * 60 * 24 * 21).toISOString(),
        venue: 'The Suttle Lodge',
        location: {
          city: 'Sisters',
          region: 'OR',
          country: 'USA',
        },
        ticketUrl: 'https://example.com/tickets',
        project: 'teb',
      },
    }),
    payload.create({
      collection: 'shows',
      draft: false,
      depth: 0,
      data: {
        _status: 'published',
        title: 'Travis Ehrenstrom (Solo) - House Show',
        slug: 'travis-solo-house-show',
        date: new Date(now + 1000 * 60 * 60 * 24 * 35).toISOString(),
        venue: 'Private Residence',
        location: {
          city: 'Bend',
          region: 'OR',
          country: 'USA',
        },
        project: 'travis',
      },
    }),
    payload.create({
      collection: 'shows',
      draft: false,
      depth: 0,
      data: {
        _status: 'published',
        title: 'TEB Festival Set',
        slug: 'teb-festival-set',
        date: new Date(now + 1000 * 60 * 60 * 24 * 60).toISOString(),
        venue: 'Summer Stage',
        location: {
          city: 'Portland',
          region: 'OR',
          country: 'USA',
        },
        project: 'teb',
      },
    }),
  ])

  payload.logger.info(`— Seeding forms...`)

  const [contactForm, newsletterForm] = await Promise.all([
    payload.create({
      collection: 'forms',
      depth: 0,
      data: contactFormData,
    }),
    payload.create({
      collection: 'forms',
      depth: 0,
      data: newsletterFormData,
    }),
  ])

  payload.logger.info(`— Seeding pages...`)

  await payload.create({
    collection: 'pages',
    depth: 0,
    data: home({
      heroImage: imageHomeDoc,
      aboutImage: image2Doc,
      featuredRelease,
      newsletterForm,
    }),
  })

  const [contactPage, aboutPage, musicPage, showsPage, storePage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: about({ portrait: image3Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: basicPage({
        slug: 'music',
        title: 'Music',
        body: 'Highlight releases, singles, playlists, and featured tracks.',
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: basicPage({
        slug: 'shows',
        title: 'Shows',
        body: 'List upcoming dates, venues, and tour announcements.',
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: basicPage({
        slug: 'store',
        title: 'Store',
        body: 'Link merch, bundles, and digital downloads.',
      }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Home',
              url: '/',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'About / Bio',
              reference: {
                relationTo: 'pages',
                value: aboutPage.id,
              },
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Music',
              reference: {
                relationTo: 'pages',
                value: musicPage.id,
              },
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Shows',
              reference: {
                relationTo: 'pages',
                value: showsPage.id,
              },
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Store',
              reference: {
                relationTo: 'pages',
                value: storePage.id,
              },
            },
          },
          {
            link: {
              type: 'custom',
              label: 'News',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Connect',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Instagram',
              newTab: true,
              url: 'https://instagram.com/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'YouTube',
              newTab: true,
              url: 'https://youtube.com/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Spotify',
              newTab: true,
              url: 'https://open.spotify.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
