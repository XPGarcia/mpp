import { SpendingType, TransactionType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"
import { InternalServerError } from "@/src/utils/errors/errors"

interface CreateCategoryForUserInput {
  userId: number
  transactionType: TransactionType
  name: string
  spendingType: SpendingType
}

export const createCategoryForUser = async (input: CreateCategoryForUserInput): Promise<Category> => {
  const { userId, transactionType, name, spendingType } = input
  const createdCategory = await CategoryRepository.createForUser({
    userId,
    transactionType,
    name,
    spendingType,
  })
  if (!createdCategory) {
    throw new InternalServerError("Failed to create category")
  }

  return createdCategory
}
