import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { clientWithToken } from '@/lib/sanity.client'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUser = await clientWithToken.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const customer = await clientWithToken.create({
      _type: 'customer',
      name,
      email,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    })

    const user = await clientWithToken.create({
      _type: 'user',
      email,
      password: hashedPassword,
      name,
      role: 'customer',
      customer: {
        _type: 'reference',
        _ref: customer._id,
      },
      emailVerified: false,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
