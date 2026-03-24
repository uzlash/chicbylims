import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  description: 'Configure the homepage hero section for Chicbylims.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label (e.g. "Homepage")',
      initialValue: 'Homepage',
      hidden: true,
    }),
    defineField({
      name: 'heroCarousel',
      title: 'Hero main carousel',
      type: 'array',
      description: 'Products shown in the large hero carousel. Order = display order.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'heroSmallCard1',
      title: 'Hero small card 1 (top)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product shown in the first small card.',
    }),
    defineField({
      name: 'heroSmallCard2',
      title: 'Hero small card 2 (bottom)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product shown in the second small card.',
    }),
    defineField({
      name: 'promoBigCard',
      title: 'Promo section – big card',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product for the large promo card (between New Arrivals and Best Sellers).',
    }),
    defineField({
      name: 'promoMediumCard1',
      title: 'Promo section – medium card 1',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product for the first medium promo card.',
    }),
    defineField({
      name: 'promoMediumCard2',
      title: 'Promo section – medium card 2',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product for the second medium promo card.',
    }),
    defineField({
      name: 'countdownProduct',
      title: 'Countdown section – product',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Product for the countdown banner (below Best Sellers).',
    }),
    defineField({
      name: 'countdownDeadline',
      title: 'Countdown deadline',
      type: 'string',
      description: 'e.g. "December 31, 2025" – used for the countdown timer.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Hero, promo & countdown',
      }
    },
  },
})
