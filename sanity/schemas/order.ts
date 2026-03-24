import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'checkoutAttemptId',
      title: 'Checkout Attempt ID',
      type: 'string',
      description: 'Used for idempotency to prevent duplicate orders on retried submissions.',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'productName',
              title: 'Product Name',
              type: 'string',
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: 'price',
              title: 'Unit Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
            },
            {
              name: 'size',
              title: 'Size',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'productName',
              quantity: 'quantity',
              price: 'price',
            },
            prepare(selection) {
              const { title, quantity, price } = selection
              return {
                title,
                subtitle: `Qty: ${quantity} × ₦${price}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping Cost',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Paystack (local)', value: 'paystack' },
          { title: 'Stripe (international)', value: 'stripe' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'NGN', value: 'NGN' },
          { title: 'USD', value: 'USD' },
        ],
      },
      description: 'Currency of the order total (NGN for Paystack, USD for Stripe).',
    }),
    defineField({
      name: 'paymentProviderReference',
      title: 'Payment Provider Reference',
      type: 'string',
      description: 'Paystack reference or Stripe session/payment ID for support.',
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Delivery option',
      type: 'string',
      description: 'From checkout: store_pickup | abuja | interstate. Store pickup = no fee; Abuja = weekdays ~₦5,000 24hrs; Interstate = Saturdays by zone.',
      options: {
        list: [
          { title: 'Store pickup', value: 'store_pickup' },
          { title: 'Abuja delivery', value: 'abuja' },
          { title: 'Interstate delivery', value: 'interstate' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'store_pickup',
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'fullName', type: 'string', title: 'Name' },
        { name: 'address1', type: 'string', title: 'Address' },
      ],
    }),
    defineField({
      name: 'paymentReceipt',
      title: 'Payment Receipt',
      type: 'file',
      description: 'Optional receipt upload (legacy). Not used for Paystack/Stripe.',
      options: {
        accept: 'image/*,.pdf',
      },
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      description: 'Customer notes or special instructions',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      description: 'Internal notes (not visible to customer)',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      total: 'total',
      status: 'status',
      currency: 'currency',
    },
    prepare(selection) {
      const { orderNumber, customerName, total, status, currency } = selection
      const cur = currency === 'USD' ? 'USD' : 'NGN'
      const sym = cur === 'USD' ? '$' : '₦'
      const n = typeof total === 'number' ? total : Number(total)
      const amt = Number.isFinite(n)
        ? n.toLocaleString(cur === 'USD' ? 'en-US' : 'en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : String(total ?? '')
      return {
        title: `Order #${orderNumber}`,
        subtitle: [customerName, `${sym}${amt}`, status].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Created Date, Old',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
  ],
})
