import { createClient } from 'next-sanity'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity configuration. Please check your .env.local file.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const CATEGORIES = [
  'Desktop',
  'Laptop',
  'Monitor',
  'Phone',
  'Watch',
  'Mouse',
  'Tablet',
  'Headphones'
]

const COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Gold', value: '#FFD700' }
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/** Fetch image from URL and upload to Sanity; returns asset document _id. */
async function uploadImageFromUrl(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'SanitySeed/1.0' } })
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${url}`)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const doc = await client.assets.upload('image', buffer, {
    filename: `seed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`,
  })
  return doc._id
}

async function seed() {
  console.log('🌱 Starting seed...')

  // 0. Clear product refs from Homepage so we can delete products (Sanity blocks delete if referenced)
  const homePageId = await client.fetch<string | null>(`*[_type == "homePage"][0]._id`)
  if (homePageId) {
    console.log('Clearing product references from Homepage...')
    await client
      .patch(homePageId)
      .set({ heroCarousel: [] })
      .unset(['heroSmallCard1', 'heroSmallCard2', 'promoBigCard', 'promoMediumCard1', 'promoMediumCard2', 'countdownProduct'])
      .commit()
    console.log('  Cleared.')
  }

  // 1. Delete existing products and categories (so re-runs don’t duplicate)
  console.log('Deleting existing products and categories...')
  await client.delete({ query: '*[_type == "product"]' })
  await client.delete({ query: '*[_type == "category"]' })
  console.log('  Deleted.')

  // 2. Create Categories
  // console.log('Creating categories...')
  // const categoryIds: string[] = []
  
  // for (const catName of CATEGORIES) {
  //   const slug = catName.toLowerCase().replace(/\s+/g, '-')
  //   const newCat = await client.create({
  //     _type: 'category',
  //     name: catName,
  //     slug: { _type: 'slug', current: slug },
  //     description: faker.commerce.productDescription(),
  //   })
  //   categoryIds.push(newCat._id)
  //   console.log(`  Created category: ${catName}`)
  // }

  // // 3. Create Products (with faker images uploaded to Sanity)
  // console.log('Creating products with images...')
  // const products = []

  // for (let i = 0; i < 50; i++) {
  //   const name = faker.commerce.productName()
  //   const price = parseFloat(faker.commerce.price({ min: 20, max: 2000 }))
  //   const categoryId = faker.helpers.arrayElement(categoryIds)
    
  //   // Generate random colors
  //   const productColors = faker.helpers.arrayElements(COLORS, { min: 1, max: 4 })
    
  //   // Generate random sizes
  //   const productSizes = faker.helpers.arrayElements(SIZES, { min: 2, max: 5 })

  //   // Upload placeholder image from Faker (Picsum) to Sanity
  //   const imageUrl = faker.image.urlPicsumPhotos({ width: 800, height: 800 })
  //   let imageRef: string
  //   try {
  //     imageRef = await uploadImageFromUrl(imageUrl)
  //   } catch (err) {
  //     console.warn(`Image upload failed for product ${i + 1}, using fallback URL:`, (err as Error).message)
  //     // Fallback: try generic Picsum URL without seed (still may work)
  //     const fallbackUrl = 'https://picsum.photos/800/800'
  //     imageRef = await uploadImageFromUrl(fallbackUrl)
  //   }

  //   const product = {
  //     _type: 'product',
  //     name,
  //     slug: { _type: 'slug', current: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.alphanumeric(5) },
  //     description: faker.commerce.productDescription(),
  //     price,
  //     comparePrice: faker.datatype.boolean() ? price * 1.2 : undefined,
  //     sku: faker.string.alphanumeric(8).toUpperCase(),
  //     inventory: faker.number.int({ min: 0, max: 100 }),
  //     status: 'active',
  //     featured: faker.datatype.boolean({ probability: 0.2 }),
  //     bestSeller: faker.datatype.boolean({ probability: 0.1 }),
  //     newArrival: faker.datatype.boolean({ probability: 0.3 }),
  //     rating: faker.number.int({ min: 1, max: 5 }),
  //     reviews: faker.number.int({ min: 0, max: 50 }),
  //     category: {
  //       _type: 'reference',
  //       _ref: categoryId
  //     },
  //     colors: productColors,
  //     sizes: productSizes,
  //     tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()],
  //     images: [
  //       { _type: 'image', asset: { _type: 'reference', _ref: imageRef } }
  //     ],
  //   }

  //   products.push(product)
  //   if ((i + 1) % 10 === 0) console.log(`  Prepared ${i + 1}/50 products...`)
  // }

  // // Batch create products
  // const transaction = client.transaction()
  // products.forEach(p => transaction.create(p))
  
  // await transaction.commit()
  
  // console.log(`✅ Successfully created ${products.length} products with images!`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
