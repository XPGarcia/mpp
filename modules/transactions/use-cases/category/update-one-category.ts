import dayjs from "dayjs"
import { inject, injectable } from "inversify"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  Category,
  CategoryRepository,
  SpendingType,
  Transaction,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"
import { TYPES } from "@/modules/container/types"
import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { calculateAmountFromExpenseToIncome, calculateAmountFromIncomeToExpense } from "@/modules/transactions/utils"
import { groupTransactionsByDate, isExpense, isIncome } from "@/utils"

export type UpdateOneCategoryInput = {
  categoryId: number
  transactionType: TransactionType
  spendingType: SpendingType
  name: string
}

export type UpdateOneCategoryOutput = Promise<Category>

export interface UpdateOneCategoryUseCase {
  execute(input: UpdateOneCategoryInput): UpdateOneCategoryOutput
}

@injectable()
export class UpdateOneCategory implements UpdateOneCategoryUseCase {
  @inject(TYPES.CategoryRepository) private readonly _categoryRepository!: CategoryRepository
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.AccountsService) private readonly _accountsService!: AccountsService
  @inject(TYPES.AccountBalanceEntriesService)
  private readonly _accountBalanceEntriesService!: AccountsBalanceEntriesService

  async execute(input: UpdateOneCategoryInput): UpdateOneCategoryOutput {
    const { categoryId, transactionType, spendingType, name } = input
    const oldCategory = await this._categoryRepository.findOneById(categoryId)
    if (!oldCategory) {
      throw new NotFoundError("Category not found")
    }

    const updatedCategory = await this._categoryRepository.updateOne(oldCategory.id, {
      spendingType,
      transactionType,
      name,
    })
    if (!updatedCategory) {
      throw new InternalServerError("Failed to update category")
    }

    const isSameTransactionType = oldCategory.transactionType === updatedCategory.transactionType
    if (isSameTransactionType) {
      return updatedCategory
    }

    await this._transactionRepository.updateManyByCategoryId(updatedCategory.id, {
      type: updatedCategory.transactionType,
    })

    const transactions = await this._transactionRepository.findAllByCategoryId(updatedCategory.id)
    if (transactions.length === 0) {
      return updatedCategory
    }

    const fromExpenseToIncome = isExpense(oldCategory.transactionType) && isIncome(updatedCategory.transactionType)
    const fromIncomeToExpense = isIncome(oldCategory.transactionType) && isExpense(updatedCategory.transactionType)

    const groupedTransactions = groupTransactionsByDate(transactions)

    for (const key in groupedTransactions) {
      const year = key.split("-")[0]
      const month = key.split("-")[1]
      const transactionsByDate = groupedTransactions[key]

      let amount = 0
      for (const transaction of transactionsByDate) {
        if (fromExpenseToIncome) {
          amount += calculateAmountFromExpenseToIncome(transaction.amount, transaction.amount)
        } else if (fromIncomeToExpense) {
          amount += calculateAmountFromIncomeToExpense(transaction.amount, transaction.amount)
        }
      }

      const accountBalanceEntry = await this._accountBalanceEntriesService.findOneByAccountAndDate({
        accountId: transactionsByDate[0].accountId,
        date: new Date(`${year}-${month}-15`), // search in the middle of the month, we just care that there is a balance entry for that month
      })
      if (!accountBalanceEntry) {
        throw new NotFoundError("Account balance entry not found")
      }

      await this._accountsService.updateBalance({ accountBalanceEntry, amount })
    }

    return updatedCategory
  }
}
