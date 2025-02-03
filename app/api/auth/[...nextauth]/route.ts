import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { usersClient } from "@/modules/users"
import { BadRequestError, InternalServerError } from "@/src/utils/errors/errors"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: number
      email: string
      firstName: string
      lastName: string
      verifiedAt: Date | null
      onboardedAt: Date | null
    }
  }
  interface User extends DefaultUser {
    id: number
    email: string
    firstName: string
    lastName: string
    verifiedAt: Date | null
    onboardedAt: Date | null
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { user, error } = await usersClient.login({
          email: credentials?.email ?? "",
          password: credentials?.password ?? "",
        })
        if (error) {
          throw new BadRequestError(error)
        }
        if (!user) {
          throw new InternalServerError("Something went wrong. Please try again later.")
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verifiedAt: user.verifiedAt,
          onboardedAt: user.onboardedAt,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.verifiedAt = user.verifiedAt
        token.onboardedAt = user.onboardedAt
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = await usersClient.findOneById({ userId: Number(token.id) })
        if (!user) {
          throw new Error("Session is invalid")
        }
        session.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verifiedAt: user.verifiedAt,
          onboardedAt: user.onboardedAt,
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
