import { SpendingType, TransactionType } from "@/src/transactions/types"
import { Category } from "../types"
import { CategoryRepository } from "../repositories/category-repository"
import { InternalServerError } from "@/src/utils/errors/errors"

const initialCategories: Pick<Category, "name" | "spendingType" | "transactionType">[] = [
  { name: "Salary", transactionType: TransactionType.INCOME, spendingType: SpendingType.NO_APPLY },
  { name: "Food", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.NECESSITY },
  { name: "Social Life", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.LUXURY },
  { name: "Bank investment", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.SAVINGS },
]

export const createInitialCategoriesForUser = async (userId: number): Promise<Category[]> => {
  const mappedCategories = []
  for (const category of initialCategories) {
    mappedCategories.push({ userId, ...category })
  }
  const createdCategories = await CategoryRepository.createManyForUser(mappedCategories)
  if (createdCategories.length === 0) {
    throw new InternalServerError("Failed to create initial categories")
  }
  return createdCategories
}
