import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Compare at Price',
      type: 'number',
      description: 'Original price for showing discounts',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Optional multiple images. Add one or more.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit',
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory Count',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'sizeVariants',
      title: 'Size / variant pricing',
      type: 'array',
      description: 'Use this for products with different prices per size or variant (e.g. "27cm → ₦28,500", "4 layers → ₦12,000"). Leave empty for standard products that use a single price.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. 27cm, 30cm, 4 layers, 500ml, Large set',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price (₦)',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0),
            },
            {
              name: 'comparePrice',
              title: 'Compare at price (₦)',
              type: 'number',
              description: 'Optional original price to show a discount',
              validation: (Rule: any) => Rule.min(0),
            },
          ],
          preview: {
            select: { label: 'label', price: 'price' },
            prepare({ label, price }: { label?: string; price?: number }) {
              return {
                title: label || 'Unnamed variant',
                subtitle: price != null ? `₦${price.toLocaleString()}` : '',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'colorVariants',
      title: 'Colors & sizes',
      type: 'array',
      description: 'Optional. Add each color and select which sizes are available for that color. Leave empty for products that use Size / variant pricing or a single price only.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'color',
              title: 'Color',
              type: 'reference',
              to: [{ type: 'color' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sizes',
              title: 'Sizes for this color',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: '10', value: '10' },
                  { title: '11', value: '11' },
                  { title: '12', value: '12' },
                  { title: '13', value: '13' },
                  { title: '14', value: '14' },
                  { title: '15', value: '15' },
                  { title: '16', value: '16' },
                ],
              },
            },
          ],
          preview: {
            select: {
              colorName: 'color.name',
              sizes: 'sizes',
            },
            prepare({ colorName, sizes }: { colorName?: string; sizes?: string[] }) {
              const sizesStr = Array.isArray(sizes) && sizes.length > 0 ? sizes.join(', ') : 'No sizes';
              return {
                title: colorName || 'Select color',
                subtitle: sizesStr,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'policy',
      title: 'Policy',
      type: 'text',
      rows: 4,
      description: 'Return / shipping policy or other policy text for this product.',
    }),
    defineField({
      name: 'deliveryInfo',
      title: 'Delivery info',
      type: 'string',
      description: 'Override default. Default: "24 hrs max within Abuja. Saturdays for interstate deliveries."',
    }),
    defineField({
      name: 'productOfMonth',
      title: 'Product of the Month',
      type: 'boolean',
      description: 'Highlight this product as the Product of the Month in hero and listings. Prefer only one at a time.',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show this product in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Out of Stock', value: 'out_of_stock' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      inventory: 'inventory',
    },
    prepare(selection) {
      const { title, media, price, inventory } = selection
      return {
        title,
        subtitle: `₦${price} - Stock: ${inventory}`,
        media,
      }
    },
  },
})
