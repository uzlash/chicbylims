import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const ALLOWED_ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (typeof orderId !== 'string' || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid orderId or status' },
        { status: 400 }
      )
    }

    // Verify the document exists and is an order, and get current status + items for inventory restore
    const existing = await clientWithToken.fetch<{
      _id: string
      status: string
      items?: Array<{ product: { _ref: string } | null; quantity: number }>
    } | null>(
      `*[_type == "order" && _id == $orderId][0]{ _id, status, "items": items[] { "product": product { _ref }, quantity } }`,
      { orderId }
    )
    if (!existing) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const previousStatus = existing.status

    await clientWithToken
      .patch(orderId)
      .set({ status })
      .commit()

    // When cancelling: restore inventory for each order item (stock was decremented on order create)
    if (status === 'cancelled' && previousStatus !== 'cancelled' && existing.items?.length) {
      for (const orderItem of existing.items) {
        const productRef = orderItem?.product?._ref
        const qty = Number(orderItem?.quantity) || 0
        if (productRef && qty > 0) {
          await clientWithToken
            .patch(productRef)
            .inc({ inventory: qty })
            .commit()
        }
      }
    }

    // Here you would typically trigger an email notification
    // await sendOrderStatusEmail(orderId, status)

    return NextResponse.json({ message: 'Order status updated' })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
