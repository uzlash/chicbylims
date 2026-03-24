import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
  )
}

export default defineConfig({
  name: 'default',
  title: 'Chicbylims Store',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // —— Orders: grouped by status ——
            S.listItem()
              .title('Orders')
              .id('orders')
              .child(
                S.list()
                  .title('Orders by status')
                  .items([
                    S.listItem()
                      .title('Pending')
                      .id('orders-pending')
                      .child(
                        S.documentList()
                          .title('Pending orders')
                          .filter('_type == "order" && status == "pending"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Confirmed')
                      .id('orders-confirmed')
                      .child(
                        S.documentList()
                          .title('Confirmed orders')
                          .filter('_type == "order" && status == "confirmed"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Processing')
                      .id('orders-processing')
                      .child(
                        S.documentList()
                          .title('Processing orders')
                          .filter('_type == "order" && status == "processing"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Shipped')
                      .id('orders-shipped')
                      .child(
                        S.documentList()
                          .title('Shipped orders')
                          .filter('_type == "order" && status == "shipped"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Delivered')
                      .id('orders-delivered')
                      .child(
                        S.documentList()
                          .title('Delivered orders')
                          .filter('_type == "order" && status == "delivered"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Cancelled')
                      .id('orders-cancelled')
                      .child(
                        S.documentList()
                          .title('Cancelled orders')
                          .filter('_type == "order" && status == "cancelled"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                  ])
              ),
            S.divider(),
            // —— Products ——
            S.listItem()
              .title('Products')
              .schemaType('product')
              .child(
                S.documentList()
                  .title('All Products')
                  .filter('_type == "product"')
                  .schemaType('product')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),
            // —— Categories ——
            S.listItem()
              .title('Categories')
              .schemaType('category')
              .child(
                S.documentList()
                  .title('All Categories')
                  .filter('_type == "category"')
                  .schemaType('category')
              ),
            S.divider(),
            // —— Global / config ——
            S.listItem()
              .title('Colors')
              .schemaType('color')
              .child(S.documentTypeList('color').title('Colors')),
            S.listItem()
              .title('Homepage')
              .schemaType('homePage')
              .child(S.documentTypeList('homePage').title('Homepage')),
            S.listItem()
              .title('Site settings')
              .schemaType('siteSettings')
              .child(S.documentTypeList('siteSettings').title('Site settings')),
            S.divider(),
            // —— Catch-all for any other doc types not listed above ——
            ...S.documentTypeListItems().filter(
              (item) =>
                !['homePage', 'siteSettings', 'product', 'category', 'order', 'color'].includes(
                  item.getId() ?? ''
                )
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
