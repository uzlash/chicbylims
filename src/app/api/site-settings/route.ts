import { NextRequest, NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/sanity.queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand') ?? undefined
    const settings = await getSiteSettings(brand || undefined)
    return NextResponse.json({
      contactPhone: settings?.contactPhone ?? null,
      contactEmail: settings?.contactEmail ?? null,
      address: settings?.address ?? null,
    })
  } catch (error) {
    console.error('Site settings API error:', error)
    return NextResponse.json(
      { contactPhone: null, contactEmail: null, address: null },
      { status: 500 }
    )
  }
}
