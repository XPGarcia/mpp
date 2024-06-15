import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json()

  return Response.json({ firstName, lastName, email })
}
