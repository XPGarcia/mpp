import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { Category, CategoryRepository, SpendingType, TransactionType } from "@/modules/transactions/domain"
import { InternalServerError } from "@/src/utils/errors/errors"

export type CreateInitialCategoriesForUserInput = {
  userId: number
}

export type CreateInitialCategoriesForUserOutput = Promise<Category[]>

export interface CreateInitialCategoriesForUserUseCase {
  execute(input: CreateInitialCategoriesForUserInput): CreateInitialCategoriesForUserOutput
}

const initialCategories: Pick<Category, "name" | "spendingType" | "transactionType">[] = [
  { name: "Salary", transactionType: TransactionType.INCOME, spendingType: SpendingType.NO_APPLY },
  { name: "Food", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.NECESSITY },
  { name: "Social Life", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.LUXURY },
  { name: "Bank investment", transactionType: TransactionType.EXPENSE, spendingType: SpendingType.SAVINGS },
]

@injectable()
export class CreateInitialCategoriesForUser implements CreateInitialCategoriesForUserUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository

  async execute(input: CreateInitialCategoriesForUserInput): CreateInitialCategoriesForUserOutput {
    const mappedCategories = []
    for (const category of initialCategories) {
      mappedCategories.push({ userId: input.userId, ...category })
    }
    const createdCategories = await this._categoryRepository.createManyForUser(mappedCategories)
    if (createdCategories.length === 0) {
      throw new InternalServerError("Failed to create initial categories")
    }
    return createdCategories
  }
}
