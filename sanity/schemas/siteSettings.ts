import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Store Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Store Address',
      type: 'text',
      description: 'Physical store address for pickup',
    }),
    defineField({
      name: 'bankTransferDetails',
      title: 'Bank Transfer Details',
      type: 'object',
      fields: [
        { name: 'bankName', type: 'string', title: 'Bank Name' },
        { name: 'accountName', type: 'string', title: 'Account Name' },
        { name: 'accountNumber', type: 'string', title: 'Account Number' },
        { name: 'routingNumber', type: 'string', title: 'Routing/SWIFT Number' },
        { name: 'instructions', type: 'text', title: 'Payment Instructions' },
      ],
    }),
    defineField({
      name: 'pickupLocations',
      title: 'Pickup Locations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Location Name' },
            { name: 'address', type: 'text', title: 'Address' },
            { name: 'hours', type: 'string', title: 'Operating Hours' },
            { name: 'phone', type: 'string', title: 'Phone' },
          ],
        },
      ],
    }),
    defineField({
      name: 'shippingMethods',
      title: 'Shipping Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Method Name' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'cost', type: 'number', title: 'Cost' },
            { name: 'estimatedDays', type: 'string', title: 'Estimated Delivery' },
          ],
        },
      ],
    }),
    defineField({
      name: 'taxRate',
      title: 'Tax Rate (%)',
      type: 'number',
      description: 'Default tax rate as percentage (e.g., 8.5 for 8.5%)',
      initialValue: 0,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
    }),
  ],
  preview: {
    select: {
      title: 'storeName',
    },
  },
})
