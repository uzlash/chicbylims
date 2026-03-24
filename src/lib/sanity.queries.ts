import { client } from './sanity.client'

// Single-store mode: brand scoping is removed, but we keep signatures compatible.
function getBrandSlugsForQuery(_urlBrand: string | undefined): string[] | null {
  return null
}

export async function getAllProducts(brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "product" && status == "active"${brandFilter}] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
      tags,
      featured,
      newArrival,
      status,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    params,
  )
}

export async function getProductBySlug(slug: string, brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''

  return client.fetch(
    `*[_type == "product" && slug.current == $slug${brandFilter}][0] {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
      productOfMonth,
      policy,
      deliveryInfo,
      tags,
      featured,
      newArrival,
      status,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    { slug, ...(brandSlugs?.length ? { brandSlugs } : {}) },
  )
}

export async function getFeaturedProducts(limit = 8, brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "product" && featured == true && status == "active"${brandFilter}] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      inventory,
      "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
      productOfMonth,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    params,
  )
}

export async function getNewArrivalProducts(limit = 8, brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "product" && newArrival == true && status == "active"${brandFilter}] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      inventory,
      "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
      productOfMonth,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    params,
  )
}

export async function getProductsByCategory(categorySlug: string, brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params: any = { categorySlug }
  if (brandSlugs?.length) params.brandSlugs = brandSlugs

  return client.fetch(
    `*[_type == "product" && category->slug.current == $categorySlug && status == "active"${brandFilter}] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      inventory,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    params,
  )
}

export async function getAllCategories(brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length
    ? ' && (!defined(brand) || brand->slug.current in $brandSlugs)'
    : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "category"${brandFilter}] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      parent->{
        _id,
        name
      }
    }`,
    params,
  )
}

/** Returns unique colors (name + hex) used by products, for shop filter. */
export async function getAllColors(brandSlug?: string): Promise<{ name: string; value: string }[]> {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  const products = await client.fetch<{ colorVariants?: { name: string; value: string }[] }[]>(
    `*[_type == "product" && status == "active"${brandFilter} && defined(colorVariants) && count(colorVariants) > 0]{
      "colorVariants": colorVariants[].color->{ name, value }
    }`,
    params,
  )
  const seen = new Set<string>()
  const result: { name: string; value: string }[] = []
  for (const p of products) {
    for (const c of p.colorVariants ?? []) {
      if (c?.name && !seen.has(c.name)) {
        seen.add(c.name)
        result.push({ name: c.name, value: c.value ?? '' })
      }
    }
  }
  return result
}

export async function getAllSizes(brandSlug?: string): Promise<string[]> {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  const products = await client.fetch<{ sizes: string[] }[]>(
    `*[_type == "product" && status == "active"${brandFilter} && defined(colorVariants) && count(colorVariants) > 0]{
      "sizes": array::unique(colorVariants[].sizes[])
    }`,
    params,
  )
  const all = products.flatMap((p) => p.sizes ?? [])
  return [...new Set(all)]
}

/** Min and max price across active products (optionally for a brand). Used for price filter bounds. */
export async function getPriceBounds(brandSlug?: string): Promise<{ min: number; max: number }> {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  const [minDoc, maxDoc] = await Promise.all([
    client.fetch<{ price: number } | null>(
      `*[_type == "product" && status == "active"${brandFilter}] | order(price asc)[0]{ price }`,
      params,
    ),
    client.fetch<{ price: number } | null>(
      `*[_type == "product" && status == "active"${brandFilter}] | order(price desc)[0]{ price }`,
      params,
    ),
  ])
  const min = minDoc?.price ?? 0
  const max = maxDoc?.price ?? (min || 1000)
  return { min, max }
}

export async function searchProducts(query: string, brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''

  return client.fetch(
    `*[_type == "product" && status == "active"${brandFilter} && (
      name match $query ||
      description match $query ||
      sku match $query
    )] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      inventory,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    {
      query: `*${query}*`,
      ...(brandSlugs?.length ? { brandSlugs } : {}),
    },
  )
}

export async function getFilteredProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  search?: string;
  page?: number;
  limit?: number;
  brand?: string;
}) {
  const { category, minPrice, maxPrice, color, size, search, brand, page = 1, limit = 20 } = filters;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  let baseQuery = `*[_type == "product" && status == "active"`;

  const params: any = {};

  if (search) {
    baseQuery += ` && (name match $search || description match $search || sku match $search)`;
    params.search = `*${search}*`;
  }

  if (brand) {
    const brandSlugs = getBrandSlugsForQuery(brand);
    if (brandSlugs?.length) {
      baseQuery += ` && brand->slug.current in $brandSlugs`;
      params.brandSlugs = brandSlugs;
    }
  }

  if (category) {
    baseQuery += ` && category->slug.current == $category`;
    params.category = category;
  }

  if (minPrice !== undefined) {
    baseQuery += ` && price >= $minPrice`;
    params.minPrice = minPrice;
  }

  if (maxPrice !== undefined) {
    baseQuery += ` && price <= $maxPrice`;
    params.maxPrice = maxPrice;
  }

  if (color) {
    baseQuery += ` && $color in colorVariants[].color->name`;
    params.color = color;
  }

  if (size) {
    baseQuery += ` && $size in colorVariants[].sizes[]`;
    params.size = size;
  }

  baseQuery += `]`;

  const query = `{
    "products": ${baseQuery} | order(_createdAt desc) [${start}...${end}] {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
      productOfMonth,
      tags,
      featured,
      newArrival,
      status,
      reviews,
      rating,
      brand->{
        _id,
        name,
        "slug": slug.current
      }
    },
    "total": count(${baseQuery})
  }`;

  return client.fetch(query, params);
}

export async function getCustomerOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && customerEmail == $email] | order(createdAt desc) {
      _id,
      orderNumber,
      total,
      currency,
      status,
      paymentStatus,
      createdAt,
      notes,
      shippingAddress,
      shippingMethod,
      items[] {
        productName,
        quantity,
        price,
        product->{
          "slug": slug.current,
          images
        }
      }
    }`,
    { email }
  )
}

const SITE_SETTINGS_PROJECTION = `{
  storeName,
  logo,
  contactEmail,
  contactPhone,
  address,
  bankTransferDetails,
  pickupLocations,
  shippingMethods,
  taxRate,
  currency
}`

export async function getSiteSettings(brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  let settings = await client.fetch(
    `*[_type == "siteSettings"${brandFilter}][0] ${SITE_SETTINGS_PROJECTION}`,
    params,
  )

  // Fallback: if no brand-specific settings (e.g. brand not set on the doc), use first available
  if (!settings && brandSlug) {
    settings = await client.fetch(
      `*[_type == "siteSettings"][0] ${SITE_SETTINGS_PROJECTION}`,
    )
  }

  return settings
}

export async function getTestimonials(brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "testimonial"${brandFilter}] | order(_createdAt desc) {
      _id,
      screenshot,
      caption
    }`,
    params,
  )
}

/** Homepage hero: main carousel + 2 small cards. Products are resolved. */
export async function getHomePageHero(brandSlug?: string) {
  const brandSlugs = brandSlug ? getBrandSlugsForQuery(brandSlug) : null
  const brandFilter = brandSlugs?.length ? ' && brand->slug.current in $brandSlugs' : ''
  const params = brandSlugs?.length ? { brandSlugs } : {}

  return client.fetch(
    `*[_type == "homePage"${brandFilter}][0] {
      "heroCarousel": heroCarousel[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "heroSmallCard1": heroSmallCard1->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "heroSmallCard2": heroSmallCard2->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoBigCard": promoBigCard->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoMediumCard1": promoMediumCard1->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoMediumCard2": promoMediumCard2->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      "countdownProduct": countdownProduct->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        "colorVariants": colorVariants[]{ color->{ name, value }, sizes },
      "sizeVariants": sizeVariants[]{ label, price, comparePrice },
        productOfMonth,
        tags,
        featured,
        newArrival,
        status,
        reviews,
        rating
      },
      countdownDeadline
    }`,
    params,
  )
}
