import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { clientWithToken } from '@/lib/sanity.client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await clientWithToken.fetch(
          `*[_type == "user" && email == $email][0] {
            _id,
            email,
            password,
            name,
            role,
            customer->{
              _id
            }
          }`,
          { email: credentials.email }
        )

        if (!user) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        await clientWithToken
          .patch(user._id)
          .set({ lastLogin: new Date().toISOString() })
          .commit()

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          customerId: user.customer?._id || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.customerId = user.customerId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.customerId = token.customerId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
