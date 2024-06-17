import { createTransaction } from "@/src/transactions/actions/create-transaction"
import { ApiResponseBuilder } from "@/src/utils/api-response"
import { apiMiddleware } from "@/src/utils/middlewares/apiMiddleware"
import { type NextRequest } from "next/server"

async function createTransactionApi(request: NextRequest) {
  const { date, amount, categoryId, typeId, description } = await request.json()
  const createdTransaction = await createTransaction({
    date,
    amount,
    categoryId,
    typeId,
    description,
  })
  return ApiResponseBuilder.created({ data: createdTransaction })
}

export const POST = apiMiddleware(createTransactionApi)
