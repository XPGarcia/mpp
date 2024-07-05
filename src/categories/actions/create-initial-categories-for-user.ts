import { TransactionType } from "@/src/transactions/types"
import { Category } from "../types"
import { CategoryRepository } from "../repositories/category-repository"
import { InternalServerError } from "@/src/utils/errors/errors"

const initialCategories: Record<TransactionType, Pick<Category, "name">[]> = {
  INCOME: [{ name: "Salary" }],
  EXPENSE: [{ name: "Food" }, { name: "Social Life" }, { name: "Bank investment" }],
}

export const createInitialCategoriesForUser = async (userId: number): Promise<Category[]> => {
  const mappedCategories = []
  for (const key in initialCategories) {
    const transactionType = key as TransactionType
    for (const category of initialCategories[transactionType]) {
      mappedCategories.push({ userId, transactionType, ...category })
    }
  }
  const createdCategories = await CategoryRepository.createManyForUser(mappedCategories)
  if (createdCategories.length === 0) {
    throw new InternalServerError("Failed to create initial categories")
  }

  return createdCategories
}
