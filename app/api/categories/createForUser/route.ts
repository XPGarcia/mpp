import { createCategoryForUser } from "@/src/categories/actions/create-category-for-user"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { apiMiddleware } from "@/src/utils/middlewares/apiMiddleware"
import { type NextRequest } from "next/server"

export type RegisterOutput = {
  firstName: string
  lastName: string
  email: string
}

async function createCategoryForUserApi(request: NextRequest) {
  const { userId, transactionTypeId, name } = await request.json()
  const category = await createCategoryForUser({ userId, transactionTypeId, name })
  return ApiResponseBuilder.created({ data: { id: category.id, name: category.name } })
}

export const POST = apiMiddleware(createCategoryForUserApi)
