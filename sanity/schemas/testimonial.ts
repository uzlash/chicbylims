import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'WhatsApp testimonial',
  type: 'document',
  description: 'Upload a mobile screenshot of a WhatsApp chat as a testimonial.',
  fields: [
    defineField({
      name: 'screenshot',
      title: 'WhatsApp chat screenshot',
      type: 'image',
      description: 'Mobile screenshot of a WhatsApp conversation (e.g. customer feedback).',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'Short label for this screenshot (e.g. "Customer review – Jan 2025"). Used for accessibility and in the studio list.',
    }),
  ],
  preview: {
    select: {
      media: 'screenshot',
      caption: 'caption',
    },
    prepare({ media, caption }) {
      return {
        title: caption || 'WhatsApp screenshot',
        media,
      }
    },
  },
})
