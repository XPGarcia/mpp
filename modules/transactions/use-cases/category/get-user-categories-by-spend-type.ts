import { TYPES } from "@/modules/container/types"
import { CategoryRepository, SpendingType } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"

export type GetUserCategoriesBySpendingTypeInput = {
  userId: number
  spendingType: SpendingType
  date?: {
    month: string
    year: string
  }
}

export type GetUserCategoriesBySpendingTypeOutput = Promise<
  {
    id: number
    name: string
    spendingTypeId: number
    totalSpend: number
  }[]
>

export interface GetUserCategoriesBySpendingTypeUseCase {
  execute(input: GetUserCategoriesBySpendingTypeInput): GetUserCategoriesBySpendingTypeOutput
}

@injectable()
export class GetUserCategoriesBySpendingType implements GetUserCategoriesBySpendingTypeUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository

  async execute(input: GetUserCategoriesBySpendingTypeInput): GetUserCategoriesBySpendingTypeOutput {
    const { userId, spendingType, date } = input
    return await this._categoryRepository.getUserCategoriesBySpendingTypeWithTotalSpend({ userId, spendingType, date })
  }
}
