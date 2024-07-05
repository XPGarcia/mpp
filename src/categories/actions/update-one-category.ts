import { TransactionType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"
import { NotFoundError } from "@/src/utils/errors/errors"

interface UpdateCategoryInput {
  categoryId: number
  transactionType: TransactionType
  name: string
}

export const updateOneCategory = async (input: UpdateCategoryInput): Promise<Category> => {
  const { categoryId, transactionType, name } = input
  const category = await CategoryRepository.findOneById(categoryId)
  if (!category) {
    throw new NotFoundError("Category not found")
  }

  const updatedCategory = await CategoryRepository.updateOne(category.id, {
    transactionType,
    name,
  })

  return updatedCategory
}
