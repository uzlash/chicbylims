import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('receipt') as File | null
    if (!file || !file.size) {
      return NextResponse.json({ error: 'No receipt file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await clientWithToken.assets.upload('file', buffer, {
      filename: file.name || 'receipt',
    })

    await clientWithToken
      .patch(orderId)
      .set({
        paymentReceipt: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
        updatedAt: new Date().toISOString(),
      })
      .commit()

    return NextResponse.json(
      { message: 'Receipt uploaded successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Receipt upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
}
