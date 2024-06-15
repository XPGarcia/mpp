import { createUser } from "@/src/auth/actions/create-user"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json()
  await createUser({ firstName, lastName, email, password })

  return Response.json({ firstName, lastName, email })
}
