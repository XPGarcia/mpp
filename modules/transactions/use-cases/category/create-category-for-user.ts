import { InternalServerError } from "@/src/utils/errors/errors"
import { Category, CategoryRepository, SpendingType, TransactionType } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"
import { TYPES } from "@/modules/container/types"

export type CreateCategoryForUserInput = {
  userId: number
  transactionType: TransactionType
  name: string
  spendingType: SpendingType
}

export type CreateCategoryForUserOutput = Promise<Category>

export interface CreateCategoryForUserUseCase {
  execute(input: CreateCategoryForUserInput): CreateCategoryForUserOutput
}

@injectable()
export class CreateCategoryForUser implements CreateCategoryForUserUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository

  async execute(input: CreateCategoryForUserInput): CreateCategoryForUserOutput {
    const { userId, transactionType, name, spendingType } = input
    const createdCategory = await this._categoryRepository.createForUser({
      userId,
      transactionType,
      name,
      spendingType,
    })
    if (!createdCategory) {
      throw new InternalServerError("Failed to create category")
    }

    return createdCategory
  }
}
