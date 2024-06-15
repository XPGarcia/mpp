import { login } from "@/src/auth/actions/login"
import { UserRepository } from "@/src/auth/repositories/user-repository"
import { BadRequestError, InternalServerError } from "@/src/utils/errors/errors"
import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: number
      email: string
      firstName: string
      lastName: string
    }
  }
}

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { user, error } = await login({
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
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = await UserRepository.findById(Number(token.id))
        if (!user) {
          throw new Error("Session is invalid")
        }
        session.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
