import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (e.g., Home, Work)' },
            { name: 'fullName', type: 'string', title: 'Full Name' },
            { name: 'address1', type: 'string', title: 'Address Line 1' },
            { name: 'address2', type: 'string', title: 'Address Line 2' },
            { name: 'city', type: 'string', title: 'City' },
            { name: 'state', type: 'string', title: 'State/Province' },
            { name: 'postalCode', type: 'string', title: 'Postal Code' },
            { name: 'country', type: 'string', title: 'Country' },
            { name: 'isDefault', type: 'boolean', title: 'Default Address' },
          ],
        },
      ],
    }),
    defineField({
      name: 'totalOrders',
      title: 'Total Orders',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'totalSpent',
      title: 'Total Spent',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Customer Since',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      totalOrders: 'totalOrders',
    },
    prepare(selection) {
      const { title, subtitle, totalOrders } = selection
      return {
        title,
        subtitle: `${subtitle} - ${totalOrders} orders`,
      }
    },
  },
})
