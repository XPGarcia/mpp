import { TransactionType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"

interface CreateCategoryForUserInput {
  userId: number
  transactionType: TransactionType
  name: string
}

export const createCategoryForUser = async (input: CreateCategoryForUserInput): Promise<Category> => {
  const { userId, transactionType, name } = input
  const createdCategory = await CategoryRepository.createForUser({
    userId,
    transactionType,
    name,
  })

  return createdCategory
}
