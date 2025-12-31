import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media } from '@/payload-types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMAGES_DIR = path.resolve(__dirname, '../tmp/epk-images')
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json')

interface ManifestImage {
  filename: string
  alt: string
  isPressPhoto: boolean
}

interface Manifest {
  images: ManifestImage[]
  videos: Array<{ youtubeId: string; title: string }>
  bandcampAlbums: Array<{ albumId: string; title: string }>
  extractedAt: string
}

const guessMimeType = (extension: string) => {
  switch (extension.toLowerCase()) {
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.jpeg':
    case '.jpg':
    default:
      return 'image/jpeg'
  }
}

const importImage = async ({
  payload,
  imagePath,
  alt,
  isPressPhoto,
}: {
  payload: Payload
  imagePath: string
  alt: string
  isPressPhoto: boolean
}): Promise<Media | null> => {
  const filename = path.basename(imagePath)
  const extension = path.extname(imagePath)

  // Check if image already exists
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  if (existing.docs?.[0]) {
    // Update isPressPhoto if not already set
    const doc = existing.docs[0] as Media
    if (!doc.isPressPhoto && isPressPhoto) {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { isPressPhoto: true },
        overrideAccess: true,
      })
      console.log(`✓ Updated existing: ${filename} (marked as press photo)`)
    } else {
      console.log(`• Skipped existing: ${filename}`)
    }
    return doc
  }

  // Read file and upload
  const buffer = fs.readFileSync(imagePath)
  const mimeType = guessMimeType(extension)

  const created = await payload.create({
    collection: 'media',
    data: {
      alt,
      isPressPhoto,
    },
    file: {
      data: buffer,
      name: filename,
      mimetype: mimeType,
      size: buffer.length,
    },
    overrideAccess: true,
  })

  console.log(`✓ Imported: ${filename}`)
  return created as Media
}

const run = async () => {
  console.log('EPK Image Import Script')
  console.log('=======================\n')

  // Check if manifest exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('Manifest not found. Run extract-epk-images.ts first.')
    process.exit(1)
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
  console.log(`Found ${manifest.images.length} images in manifest`)
  console.log(`Extracted at: ${manifest.extractedAt}\n`)

  const payload = await getPayload({ config: configPromise })
  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  }

  try {
    for (const image of manifest.images) {
      const imagePath = path.join(IMAGES_DIR, image.filename)

      if (!fs.existsSync(imagePath)) {
        console.error(`✗ File not found: ${image.filename}`)
        results.failed++
        continue
      }

      try {
        const result = await importImage({
          payload,
          imagePath,
          alt: image.alt,
          isPressPhoto: image.isPressPhoto,
        })

        if (result) {
          results.imported++
        }
      } catch (error) {
        console.error(`✗ Failed to import ${image.filename}:`, error)
        results.failed++
      }
    }

    console.log('\n=======================')
    console.log('Import Summary:')
    console.log(`  Imported: ${results.imported}`)
    console.log(`  Failed: ${results.failed}`)
    console.log('\nVideo IDs for EPK page:')
    manifest.videos.forEach((video) => {
      console.log(`  - ${video.title}: ${video.youtubeId}`)
    })
    console.log('\nBandcamp Albums for EPK page:')
    manifest.bandcampAlbums.forEach((album) => {
      console.log(`  - ${album.title}: ${album.albumId}`)
    })
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})

