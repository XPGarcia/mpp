import { SpendingType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"

interface Params {
  userId: number
  spendingType: SpendingType
  date?: {
    month: string
    year: string
  }
}

export const getUserCategoriesBySpendingTypeWithTotalForUser = async ({ userId, spendingType, date }: Params) => {
  return await CategoryRepository.getUserCategoriesBySpendingTypeWithTotalSpend({ userId, spendingType, date })
}
