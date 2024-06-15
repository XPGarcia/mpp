import { createUser } from "@/src/auth/actions/create-user"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { type NextRequest } from "next/server"

export type RegisterOutput = {
  firstName: string
  lastName: string
  email: string
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json()
  try {
    await createUser({ firstName, lastName, email, password })
  } catch (error) {
    return ApiResponseBuilder.error({ error })
  }

  return ApiResponseBuilder.created({ data: { firstName, lastName, email } })
}
