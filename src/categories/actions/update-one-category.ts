import { SpendingType, TransactionType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"
import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"

interface UpdateCategoryInput {
  categoryId: number
  transactionType: TransactionType
  spendingType: SpendingType
  name: string
}

export const updateOneCategory = async (input: UpdateCategoryInput): Promise<Category> => {
  const { categoryId, transactionType, spendingType, name } = input
  const category = await CategoryRepository.findOneById(categoryId)
  if (!category) {
    throw new NotFoundError("Category not found")
  }

  const updatedCategory = await CategoryRepository.updateOne(category.id, {
    spendingType,
    transactionType,
    name,
  })
  if (!updatedCategory) {
    throw new InternalServerError("Failed to update category")
  }

  return updatedCategory
}
