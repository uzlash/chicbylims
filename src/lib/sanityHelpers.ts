import { SanityProduct, SanityCategory, SanityTestimonial } from '@/types/sanity'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Testimonial } from '@/types/testimonial'
import { urlFor } from './sanity.image'

export function sanityProductToProduct(sanityProduct: SanityProduct): Product {
  const thumbnails = sanityProduct.images
    ? sanityProduct.images.map((img) => urlFor(img).width(400).height(400).url())
    : []
  const previews = sanityProduct.images
    ? sanityProduct.images.map((img) => urlFor(img).width(800).height(800).url())
    : []

  return {
    id: sanityProduct._id,
    title: sanityProduct.name,
    description: sanityProduct.description,
    slug: sanityProduct.slug,
    price: sanityProduct.comparePrice || sanityProduct.price,
    discountedPrice: sanityProduct.price,
    imgs: {
      thumbnails,
      previews,
    },
    colors: sanityProduct.colorVariants?.map((v) => v.color) ?? [],
    sizes: sanityProduct.colorVariants?.[0]?.sizes ?? [],
    colorVariants: sanityProduct.colorVariants,
    sizeVariants: sanityProduct.sizeVariants,
    productOfMonth: !!sanityProduct.productOfMonth,
    policy: sanityProduct.policy,
    deliveryInfo: sanityProduct.deliveryInfo,
    stock: sanityProduct.inventory,
  }
}

export function sanityProductsToProducts(sanityProducts: SanityProduct[]): Product[] {
  return sanityProducts.map(sanityProductToProduct)
}

export function sanityCategoryToCategory(sanityCategory: SanityCategory): Category {
  return {
    id: sanityCategory._id,
    title: sanityCategory.name,
    slug: sanityCategory.slug,
    img: sanityCategory.image ? urlFor(sanityCategory.image).width(200).height(200).url() : '',
  }
}

export function sanityCategoriesToCategories(sanityCategories: SanityCategory[]): Category[] {
  return sanityCategories.map(sanityCategoryToCategory)
}

export function sanityTestimonialToTestimonial(sanityTestimonial: SanityTestimonial): Testimonial {
  return {
    id: sanityTestimonial._id,
    screenshotUrl: sanityTestimonial.screenshot ? urlFor(sanityTestimonial.screenshot).width(1200).url() : '',
    caption: sanityTestimonial.caption,
  }
}

export function sanityTestimonialsToTestimonials(sanityTestimonials: SanityTestimonial[]): Testimonial[] {
  return sanityTestimonials.map(sanityTestimonialToTestimonial)
}
