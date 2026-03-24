import { clientWithToken } from './sanity.client'

export async function getAdminDashboardStats() {
  const totalRevenue = await clientWithToken.fetch(`math::sum(*[_type == "order" && status != "cancelled"].total)`)
  const totalOrders = await clientWithToken.fetch(`count(*[_type == "order"])`)
  const totalProducts = await clientWithToken.fetch(`count(*[_type == "product"])`)
  const totalCustomers = await clientWithToken.fetch(`count(*[_type == "customer"])`)
  
  const recentOrders = await clientWithToken.fetch(
    `*[_type == "order"] | order(createdAt desc) [0...5] {
      _id,
      orderNumber,
      customerName,
      total,
      status,
      createdAt
    }`
  )

  return {
    totalRevenue: totalRevenue || 0,
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalCustomers: totalCustomers || 0,
    recentOrders: recentOrders || []
  }
}
