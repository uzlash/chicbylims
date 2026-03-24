import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'

// Server-side shipping fees (must match frontend ShippingMethod.tsx)
const DELIVERY_FEES = { store_pickup: 0, abuja: 5000, interstate: 7000 }
const INTERSTATE_ZONES: { value: string; fee: number }[] = [
  { value: 'northwest', fee: 7000 }, { value: 'northeast', fee: 7000 },
  { value: 'northcentral', fee: 7000 }, { value: 'southwest', fee: 7000 },
  { value: 'southeast', fee: 7000 }, { value: 'southsouth', fee: 7000 },
  { value: 'other', fee: 0 },
]

function getNgnToUsdRate(): number {
  const raw = process.env.NGN_TO_USD_RATE ?? process.env.NEXT_PUBLIC_NGN_TO_USD_RATE
  if (typeof raw === 'string') {
    const parsed = parseFloat(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0.0006
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { items, shippingAddress, shippingMethod, interstateZone, email, name, phone, notes, paymentMethod: rawPaymentMethod, checkoutAttemptId } = body

    const paymentMethod = rawPaymentMethod === 'stripe' ? 'stripe' : rawPaymentMethod === 'paystack' ? 'paystack' : null
    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'paymentMethod is required (paystack or stripe)' },
        { status: 400 }
      )
    }
    const normalizedAttemptId =
      typeof checkoutAttemptId === 'string' ? checkoutAttemptId.trim() : ''
    if (!normalizedAttemptId) {
      return NextResponse.json(
        { error: 'checkoutAttemptId is required' },
        { status: 400 }
      )
    }
    const safeAttemptId = normalizedAttemptId.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120)
    const orderDocId = `order-${safeAttemptId}`

    const existingOrder = await clientWithToken.fetch(
      `*[_type == "order" && _id == $orderDocId][0]{
        _id,
        orderNumber,
        total,
        currency
      }`,
      { orderDocId }
    )

    if (existingOrder?._id) {
      return NextResponse.json(
        {
          message: 'Order already exists for this checkout attempt',
          orderId: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          total: existingOrder.total,
          currency: existingOrder.currency,
          deduped: true,
        },
        { status: 200 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock, resolve to Sanity product _id, and get server-side price + productOfMonth
    const productIdByItemKey: string[] = []
    const resolvedProducts: { _id: string; price: number; productOfMonth?: boolean }[] = []
    for (const item of items) {
      const idParam = item.id || item._id
      let product = await clientWithToken.fetch(
        `*[_type == "product" && _id == $id][0] { inventory, name, _id, price, productOfMonth, "sizeVariants": sizeVariants[]{ label, price } }`,
        { id: idParam }
      )
      if (!product && (item.slug || (typeof idParam === 'string' && !idParam.startsWith('product-') && idParam.length < 50))) {
        const slug = item.slug || idParam
        product = await clientWithToken.fetch(
          `*[_type == "product" && slug.current == $slug][0] { inventory, name, _id, price, productOfMonth, "sizeVariants": sizeVariants[]{ label, price } }`,
          { slug }
        )
      }

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.title}` },
          { status: 400 }
        )
      }

      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.inventory} left.` },
          { status: 400 }
        )
      }

      // For products with per-variant pricing, resolve the price from the matching sizeVariant
      let resolvedPrice = Number(product.price) ?? 0
      const sizeVariants: Array<{ label: string; price: number }> = product.sizeVariants ?? []
      if (sizeVariants.length > 0 && item.size) {
        const matchedVariant = sizeVariants.find(
          (sv: { label: string; price: number }) => sv.label === item.size
        )
        if (matchedVariant) {
          resolvedPrice = Number(matchedVariant.price)
        }
      }

      productIdByItemKey.push(product._id)
      resolvedProducts.push({
        _id: product._id,
        price: resolvedPrice,
        productOfMonth: Boolean(product.productOfMonth),
      })
    }

    // Recompute subtotal from server-side prices (ignore client-supplied totals)
    const serverSubtotal = resolvedProducts.reduce(
      (sum, p, i) => sum + p.price * (items[i].quantity || 0),
      0
    )

    // Recompute shipping and total
    const method = shippingMethod === 'store_pickup' || shippingMethod === 'abuja' || shippingMethod === 'interstate'
      ? shippingMethod
      : 'store_pickup'
    const hasProductOfMonth = resolvedProducts.some((p) => p.productOfMonth)
    const freeAbujaDelivery = method === 'abuja' && hasProductOfMonth && items.length >= 3
    const serverShippingCost =
      method === 'store_pickup'
        ? 0
        : freeAbujaDelivery
          ? 0
          : method === 'abuja'
            ? DELIVERY_FEES.abuja
            : INTERSTATE_ZONES.find((z) => z.value === (interstateZone || 'northwest'))?.fee ?? DELIVERY_FEES.interstate
    const serverTotalNgn = serverSubtotal + serverShippingCost
    const currency = paymentMethod === 'stripe' ? 'USD' : 'NGN'
    const rate = getNgnToUsdRate()
    const serverTotal = paymentMethod === 'stripe' ? Math.round(serverTotalNgn * rate * 100) / 100 : serverTotalNgn

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create customer if guest
    let customerId = session?.user?.customerId

    if (!customerId) {
      // Check if customer exists by email
      const existingCustomer = await clientWithToken.fetch(
        `*[_type == "customer" && email == $email][0]._id`,
        { email }
      )

      if (existingCustomer) {
        customerId = existingCustomer
      } else {
        // Create new customer
        const newCustomer = await clientWithToken.create({
          _type: 'customer',
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0
        })
        customerId = newCustomer._id
      }
    }

    // Orders are not scoped by brand (single bank account for HEIM + Kinder); one Orders list in Sanity.

    const sanitizedShippingAddress =
      shippingAddress && typeof shippingAddress === 'object'
        ? { fullName: shippingAddress.fullName ?? '', address1: shippingAddress.address1 ?? '' }
        : { fullName: '', address1: '' }

    const orderSubtotal = paymentMethod === 'stripe' ? Math.round(serverSubtotal * rate * 100) / 100 : serverSubtotal
    const orderShippingCost = paymentMethod === 'stripe' ? Math.round(serverShippingCost * rate * 100) / 100 : serverShippingCost

    let order
    try {
      order = await clientWithToken.create({
      _id: orderDocId,
      _type: 'order',
      orderNumber,
      checkoutAttemptId: normalizedAttemptId,
      customer: {
        _type: 'reference',
        _ref: customerId,
      },
      customerEmail: email,
      customerName: name,
      customerPhone: phone,
      items: items.map((item: any, index: number) => ({
        _key: Math.random().toString(36).substring(7),
        product: {
          _type: 'reference',
          _ref: productIdByItemKey[index],
        },
        productName: item.title,
        quantity: item.quantity,
        price: paymentMethod === 'stripe' ? Math.round(resolvedProducts[index].price * rate * 100) / 100 : resolvedProducts[index].price,
        color: item.color,
        size: item.size,
      })),
      shippingAddress: sanitizedShippingAddress,
      shippingMethod: method,
      subtotal: orderSubtotal,
      shippingCost: orderShippingCost,
      total: serverTotal,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      currency,
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString(),
    })
    } catch (createError: any) {
      const conflictLike =
        typeof createError?.message === 'string' &&
        (createError.message.includes('already exists') || createError.message.includes('409'))

      if (conflictLike) {
        const conflictOrder = await clientWithToken.fetch(
          `*[_type == "order" && _id == $orderDocId][0]{
            _id,
            orderNumber,
            total,
            currency
          }`,
          { orderDocId }
        )
        if (conflictOrder?._id) {
          return NextResponse.json(
            {
              message: 'Order already exists for this checkout attempt',
              orderId: conflictOrder._id,
              orderNumber: conflictOrder.orderNumber,
              total: conflictOrder.total,
              currency: conflictOrder.currency,
              deduped: true,
            },
            { status: 200 }
          )
        }
      }
      throw createError
    }

    // Update inventory (use resolved Sanity product _id)
    for (let i = 0; i < items.length; i++) {
      await clientWithToken
        .patch(productIdByItemKey[i])
        .dec({ inventory: items[i].quantity })
        .commit()
    }

    await clientWithToken
      .patch(customerId)
      .inc({ totalOrders: 1, totalSpent: serverTotalNgn })
      .commit()

    await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail: email,
      customerName: name,
      items: items.map((item: any, index: number) => ({
        productName: item.title,
        quantity: item.quantity,
        price: paymentMethod === 'stripe' ? Math.round(resolvedProducts[index].price * rate * 100) / 100 : resolvedProducts[index].price,
      })),
      total: serverTotal,
    })

    return NextResponse.json(
      { message: 'Order created successfully', orderId: order._id, orderNumber, total: serverTotal, currency },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
