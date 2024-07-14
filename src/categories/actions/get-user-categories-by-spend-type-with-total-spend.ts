import { SpendingType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"

interface Params {
  userId: number
  spendingType: SpendingType
}

export const getUserCategoriesBySpendingTypeWithTotalForUser = async ({ userId, spendingType }: Params) => {
  return await CategoryRepository.getUserCategoriesBySpendingTypeWithTotalSpend({ userId, spendingType })
}
