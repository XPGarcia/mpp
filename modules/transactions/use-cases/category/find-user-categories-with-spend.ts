import { TYPES } from "@/modules/container/types"
import { Category, CategoryRepository, FindUserCategoriesFilters, WithSpend } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"

export type FindUserCategoriesWithSpendInput = {
  userId: number
  filters: FindUserCategoriesFilters
}

export type FindUserCategoriesWithSpendOutput = Promise<WithSpend<Category>[]>

export interface FindUserCategoriesWithSpendUseCase {
  execute(input: FindUserCategoriesWithSpendInput): FindUserCategoriesWithSpendOutput
}

@injectable()
export class FindUserCategoriesWithSpend implements FindUserCategoriesWithSpendUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository

  async execute(input: FindUserCategoriesWithSpendInput): FindUserCategoriesWithSpendOutput {
    const { userId, filters } = input
    return await this._categoryRepository.findUserCategoriesWithSpend({ userId, filters })
  }
}
