import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      validation: (Rule) => Rule.required(),
      hidden: true,
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'customer',
    }),
    defineField({
      name: 'customer',
      title: 'Customer Profile',
      type: 'reference',
      to: [{ type: 'customer' }],
      description: 'Link to customer profile if role is customer',
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      role: 'role',
    },
    prepare(selection) {
      const { title, subtitle, role } = selection
      return {
        title,
        subtitle: `${subtitle} (${role})`,
      }
    },
  },
})
