import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { BadRequestError } from "@/src/utils/errors/errors"
import { CategoryRepository } from "../repositories/category-repository"

export const deleteOneCategory = async (categoryId: number) => {
  const transactionsCount = await TransactionRepository.countByCategoryId(categoryId)
  if (transactionsCount > 0) {
    throw new BadRequestError(
      "Category has transactions associated. Please delete the transactions before deleting the category"
    )
  }

  await CategoryRepository.deleteOne(categoryId)
}
