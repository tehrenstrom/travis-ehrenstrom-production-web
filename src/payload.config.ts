import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Releases } from './collections/Releases'
import { Shows } from './collections/Shows'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storageBucket = process.env.R2_BUCKET || process.env.S3_BUCKET
const storageEndpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT
const storageAccessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID
const storageSecretAccessKey =
  process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY
const storagePublicURL = process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL
const storageForcePathStyle = process.env.R2_FORCE_PATH_STYLE || process.env.S3_FORCE_PATH_STYLE
const storageRegion = process.env.R2_REGION || process.env.S3_REGION || 'auto'

const storageEnabled = Boolean(
  storageBucket && storageEndpoint && storageAccessKeyId && storageSecretAccessKey,
)

const buildStorageURL = (filename: string, prefix?: string) => {
  if (!storagePublicURL) return ''

  const baseURL = storagePublicURL.replace(/\/$/, '')
  const objectPath = path.posix.join(prefix || '', encodeURIComponent(filename))

  return `${baseURL}/${objectPath}`
}

const storagePlugin = storageEnabled
  ? s3Storage({
      bucket: storageBucket as string,
      clientUploads: true,
      collections: {
        media: storagePublicURL
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) => buildStorageURL(filename, prefix),
            }
          : true,
      },
      config: {
        credentials: {
          accessKeyId: storageAccessKeyId as string,
          secretAccessKey: storageSecretAccessKey as string,
        },
        endpoint: storageEndpoint,
        forcePathStyle: storageForcePathStyle ? storageForcePathStyle === 'true' : true,
        region: storageRegion,
      },
    })
  : null

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@tebmusic.com',
    defaultFromName: 'Travis Ehrenstrom Band',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [Pages, Posts, Shows, Releases, Products, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [...plugins, ...(storagePlugin ? [storagePlugin] : [])],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
