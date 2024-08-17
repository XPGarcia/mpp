import { BadRequestError } from "@/src/utils/errors/errors"
import { inject, injectable } from "inversify"
import { TYPES } from "@/modules/container/types"
import { CategoryRepository, TransactionRepository } from "@/modules/transactions/domain"

export type DeleteOneCategoryInput = {
  categoryId: number
}

export type DeleteOneCategoryOutput = Promise<void>

export interface DeleteOneCategoryUseCase {
  execute(input: DeleteOneCategoryInput): DeleteOneCategoryOutput
}

@injectable()
export class DeleteOneCategory implements DeleteOneCategoryUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: DeleteOneCategoryInput): DeleteOneCategoryOutput {
    const transactionsCount = await this._transactionRepository.countByCategoryId(input.categoryId)
    if (transactionsCount > 0) {
      throw new BadRequestError(
        "Category has transactions associated. Please delete the transactions before deleting the category"
      )
    }
    await this._categoryRepository.deleteOne(input.categoryId)
  }
}
