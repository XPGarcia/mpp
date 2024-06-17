import { createTransaction } from "@/src/transactions/actions/create-transaction"
import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { BadRequestError } from "@/src/utils/errors/errors"
import { apiMiddleware } from "@/src/utils/middlewares/apiMiddleware"
import { type NextRequest } from "next/server"

async function createTransactionApi(request: NextRequest) {
  const { userId, date, amount, categoryId, typeId, description } = await request.json()
  const createdTransaction = await createTransaction({
    userId,
    date,
    amount,
    categoryId,
    typeId,
    description,
  })
  return ApiResponseBuilder.created({ data: createdTransaction })
}

export const POST = apiMiddleware(createTransactionApi)

async function getTransactionsApi(request: NextRequest) {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.searchParams)
  const userId = params.get("userId")
  if (!userId || userId === "") {
    throw new BadRequestError("User ID is required")
  }

  const transactions = await TransactionRepository.findAllByUserId(Number(userId))
  return ApiResponseBuilder.ok({ data: transactions })
}

export const GET = apiMiddleware(getTransactionsApi)
