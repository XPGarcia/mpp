import { CategoryRepository } from "@/src/categories/repositories/category-repository"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { BadRequestError } from "@/src/utils/errors/errors"
import { apiMiddleware } from "@/src/utils/middlewares/apiMiddleware"
import { type NextRequest } from "next/server"

export type RegisterOutput = {
  firstName: string
  lastName: string
  email: string
}

async function getCategories(request: NextRequest) {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.searchParams)
  const userId = params.get("userId")
  const transactionTypeId = params.get("transactionTypeId")
  if (!userId || userId === "" || !transactionTypeId || transactionTypeId === "") {
    throw new BadRequestError("User ID and TransactionType ID are required")
  }

  const categories = await CategoryRepository.getUserCategoriesByTransaction({
    userId: Number(userId),
    transactionTypeId: Number(transactionTypeId),
  })
  return ApiResponseBuilder.ok({ data: categories })
}

export const GET = apiMiddleware(getCategories)
