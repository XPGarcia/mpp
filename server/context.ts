import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { NextApiRequest } from "@trpc/server/adapters/next"
import { getToken } from "next-auth/jwt"

export async function createContext(options: FetchCreateContextFnOptions) {
  let user: { id: number; email: string } | null = null
  const token = await getToken({ req: options?.req as unknown as NextApiRequest })
  if (token) {
    user = {
      id: Number(token.id),
      email: token.email as string,
    }
  }
  return {
    user,
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>
