import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"

interface CreateCategoryForUserInput {
  userId: number
  transactionTypeId: number
  name: string
}

export const createCategoryForUser = async (input: CreateCategoryForUserInput): Promise<Category> => {
  const { userId, transactionTypeId, name } = input
  const createdCategory = await CategoryRepository.createForUser({
    userId,
    transactionTypeId,
    name,
  })

  return createdCategory
}
