export interface SanityProduct {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images: SanityImage[]
  category?: {
    _id: string
    name: string
    slug: string
  }
  sku?: string
  inventory: number
  colors?: Array<{
    name: string
    value: string
  }>
  sizes?: string[]
  colorVariants?: Array<{
    color: { name: string; value: string }
    sizes: string[]
  }>
  sizeVariants?: Array<{
    label: string
    price: number
    comparePrice?: number
  }>
  productOfMonth?: boolean
  policy?: string
  deliveryInfo?: string
  tags?: string[]
  featured?: boolean
  newArrival?: boolean
  status: string
}

export interface SanityImage {
  _key?: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface SanityCategory {
  _id: string
  name: string
  slug: string
  description?: string
  image?: SanityImage
  parent?: {
    _id: string
    name: string
  }
}

export interface SiteSettings {
  storeName: string
  logo?: SanityImage
  contactEmail?: string
  contactPhone?: string
  address?: string
  bankTransferDetails?: {
    bankName: string
    accountName: string
    accountNumber: string
    routingNumber?: string
    instructions?: string
  }
  pickupLocations?: Array<{
    name: string
    address: string
    hours?: string
    phone?: string
  }>
  shippingMethods?: Array<{
    name: string
    description?: string
    cost: number
    estimatedDays?: string
  }>
  taxRate?: number
  currency?: string
}

export interface SanityTestimonial {
  _id: string
  screenshot: SanityImage
  caption?: string
}
