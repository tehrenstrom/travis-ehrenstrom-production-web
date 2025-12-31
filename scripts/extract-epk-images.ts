import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.resolve(__dirname, '../tmp/epk-images')

// Image URLs extracted from https://www.travisehrenstrom.com/booking
// These are the full-resolution versions (format=1500w or no format param)
const EPK_IMAGES = [
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1621871374942-TDVH24YAEHH0C4U5EDGY/IMG_1054.jpeg',
    filename: 'IMG_1054.jpeg',
    alt: 'Travis Ehrenstrom performing live',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1621872011232-YHLD0ODFT3QE7RRFNNUH/IMG_0001.JPG',
    filename: 'IMG_0001.jpg',
    alt: 'Travis Ehrenstrom portrait',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1621871253761-WLN25GNWO3PV3LT43GEY/IMG_5264.jpg',
    filename: 'IMG_5264.jpg',
    alt: 'Travis Ehrenstrom Band live performance',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1699548087778-0B9EMPUHPM6KFIJSPULS/IMG_5894.jpeg',
    filename: 'IMG_5894.jpeg',
    alt: 'TEB live show',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1621871378210-U436284M61IAYGI6N9MC/IMG_1055.JPG',
    filename: 'IMG_1055.jpg',
    alt: 'Travis Ehrenstrom on stage',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237699017-TSKXGI0ZCRF06H1F41W5/DSC01972-Enhanced-NR.jpeg',
    filename: 'DSC01972-Enhanced-NR.jpeg',
    alt: 'TEB band photo',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237700420-OG18HQ7KV6DHOAYVLJO4/DSC07208Large.jpeg',
    filename: 'DSC07208Large.jpeg',
    alt: 'Travis Ehrenstrom Band performing',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237702559-BBPRIU7G28C38UKY4G1I/DSC04851-Enhanced-NRLarge.jpeg',
    filename: 'DSC04851-Enhanced-NRLarge.jpeg',
    alt: 'TEB concert photo',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237705327-WVULQFFZ6TNUOHGZ5A6G/TEBxHouseofNeil-12.jpeg',
    filename: 'TEBxHouseofNeil-12.jpeg',
    alt: 'TEB at House of Neil',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237707777-7VR9NGBQ5Z5IS9S918V3/DSC04834Large.jpeg',
    filename: 'DSC04834Large.jpeg',
    alt: 'Live performance photo',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237709318-V1WO0SCDERSET71L3PS7/DSC02893-Enhanced-NRLarge.jpeg',
    filename: 'DSC02893-Enhanced-NRLarge.jpeg',
    alt: 'Band on stage',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237710661-UYYLTBLQYVZDRIVZPHQB/DSC07326-Enhanced-NRLarge.jpeg',
    filename: 'DSC07326-Enhanced-NRLarge.jpeg',
    alt: 'TEB live concert',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237712503-A5G10EW0RCBD76L4OH12/DSC07501-Enhanced-NRLarge.jpeg',
    filename: 'DSC07501-Enhanced-NRLarge.jpeg',
    alt: 'Travis Ehrenstrom Band performance',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237713669-CE5XLHIEL9FQMGRXPD87/DSC07361-Enhanced-NRLarge.jpeg',
    filename: 'DSC07361-Enhanced-NRLarge.jpeg',
    alt: 'Concert photography',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237714979-B15UZU2XOYBLP2EC2W9F/DSC07293-Enhanced-NRLarge.jpeg',
    filename: 'DSC07293-Enhanced-NRLarge.jpeg',
    alt: 'TEB stage performance',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237717899-BDDTS114ZGJCJ6BXR3D3/DSC07193Large.jpeg',
    filename: 'DSC07193Large.jpeg',
    alt: 'Live music photo',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741237720975-OUZ0MC8XRJEAB5RDVSM3/DSC01913-Enhanced-NR.jpeg',
    filename: 'DSC01913-Enhanced-NR.jpeg',
    alt: 'Travis Ehrenstrom performing',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741238033066-GEN586D8Y5LFHA7NOOQL/TEBxHouseofNeil-11.jpeg',
    filename: 'TEBxHouseofNeil-11.jpeg',
    alt: 'TEB at House of Neil venue',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5c291c754eddecdc6f457942/1741238035845-JV422O5XHIV9XM7VKFQI/TEBxHouseofNeil-01.jpeg',
    filename: 'TEBxHouseofNeil-01.jpeg',
    alt: 'Band photo at House of Neil',
  },
]

// YouTube videos found on the booking page
const EPK_VIDEOS = [
  { youtubeId: 'rGZGFFtIvUA', title: 'TEB Live Performance' },
  { youtubeId: 'sBKTnIlxg0A', title: 'Travis Ehrenstrom Music Video' },
  { youtubeId: 'NvoRfz8yfNM', title: 'TEB Concert Footage' },
  { youtubeId: 'dQX6dus6ntU', title: 'Live Session' },
]

// Bandcamp album IDs for music embeds
const EPK_BANDCAMP_ALBUMS = [
  { albumId: '1036058387', title: 'Lady Luck' },
  { albumId: '3485703757', title: 'Hollinshead' },
]

const downloadImage = async (url: string, filename: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TEB EPK Import Script (https://travisehrenstrom.com)',
      },
    })

    if (!response.ok) {
      console.error(`Failed to download ${filename}: ${response.status}`)
      return false
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const outputPath = path.join(OUTPUT_DIR, filename)

    fs.writeFileSync(outputPath, buffer)
    console.log(`✓ Downloaded: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
    return true
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error)
    return false
  }
}

const run = async () => {
  console.log('EPK Image Extraction Script')
  console.log('===========================\n')

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created output directory: ${OUTPUT_DIR}\n`)
  }

  // Download images
  console.log(`Downloading ${EPK_IMAGES.length} images...\n`)
  const results = {
    success: 0,
    failed: 0,
  }

  for (const image of EPK_IMAGES) {
    const success = await downloadImage(image.url, image.filename)
    if (success) {
      results.success++
    } else {
      results.failed++
    }
  }

  // Write manifest file for import
  const manifest = {
    images: EPK_IMAGES.map((img) => ({
      filename: img.filename,
      alt: img.alt,
      isPressPhoto: true,
    })),
    videos: EPK_VIDEOS,
    bandcampAlbums: EPK_BANDCAMP_ALBUMS,
    extractedAt: new Date().toISOString(),
  }

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\n✓ Manifest written to: ${manifestPath}`)

  console.log('\n===========================')
  console.log(`Download complete: ${results.success} succeeded, ${results.failed} failed`)
  console.log(`\nImages saved to: ${OUTPUT_DIR}`)
  console.log('\nNext step: Run the import script to upload images to Payload CMS')
}

run().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})

