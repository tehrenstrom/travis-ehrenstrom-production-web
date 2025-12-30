import configPromise from '@payload-config'
import { getPayload } from 'payload'
import fs from 'fs/promises'

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  const page = result.docs?.[0]
  await fs.writeFile('/tmp/home-local.json', JSON.stringify(page, null, 2))
  console.log('Wrote /tmp/home-local.json')
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
