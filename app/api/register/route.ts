import { createUser } from "@/src/auth/actions/create-user"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { apiMiddleware } from "@/src/utils/middlewares/apiMiddleware"
import { type NextRequest } from "next/server"

export type RegisterOutput = {
  firstName: string
  lastName: string
  email: string
}

async function createUserApi(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json()
  await createUser({ firstName, lastName, email, password })
  return ApiResponseBuilder.created({ data: { firstName, lastName, email } })
}

export const POST = apiMiddleware(createUserApi)
