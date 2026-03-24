import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
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
      name: 'logo',
      title: 'Brand Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Hex color code used for primary accents (e.g., #000000).',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Hex color code used for secondary accents.',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Optional extra accent color.',
    }),
    defineField({
      name: 'about',
      title: 'About / Tagline',
      type: 'text',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})

