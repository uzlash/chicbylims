import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'color',
  title: 'Color',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Color name',
      type: 'string',
      description: 'e.g. Red, Navy Blue, Black',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Hex code',
      type: 'string',
      description: 'e.g. #FF0000',
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex',
        invert: false,
      }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      value: 'value',
    },
    prepare({ title, value }) {
      return {
        title: title || 'Unnamed color',
        subtitle: value || '',
      }
    },
  },
})
