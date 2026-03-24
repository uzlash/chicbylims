import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN for read-only product/category data; reduces origin load
})

export const clientWithToken = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
