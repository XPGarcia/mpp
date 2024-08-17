import { Category, CategoryRepository, TransactionType } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"
import { TYPES } from "@/modules/container/types"

export type GetUserCategoriesByTransactionInput = {
  userId: number
  transactionType: TransactionType
}

export type GetUserCategoriesByTransactionOutput = Promise<Category[]>

export interface GetUserCategoriesByTransactionUseCase {
  execute(input: GetUserCategoriesByTransactionInput): GetUserCategoriesByTransactionOutput
}

@injectable()
export class GetUserCategoriesByTransaction implements GetUserCategoriesByTransactionUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository

  async execute(input: GetUserCategoriesByTransactionInput): GetUserCategoriesByTransactionOutput {
    return await this._categoryRepository.getUserCategoriesByTransaction({
      userId: input.userId,
      transactionType: input.transactionType,
    })
  }
}
