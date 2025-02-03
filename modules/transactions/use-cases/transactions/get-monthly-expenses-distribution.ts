import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { SpendingType, TransactionRepository } from "@/modules/transactions/domain"
import { InternalServerError } from "@/src/utils/errors/errors"
import { calculatePercentageFromTotal } from "@/src/utils/math"
import { isIncome, isLuxury, isNecessity, isSavings } from "@/utils"

export type GetMonthlyExpensesDistributionInput = {
  userId: number
  month: string
  year: string
}

export type GetMonthlyExpensesDistributionOutput = Promise<{
  totalIncome: number
  expensesDistribution: Omit<Record<SpendingType, { total: number; percentage: number }>, "NO_APPLY">
}>

export interface GetMonthlyExpensesDistributionForUserUseCase {
  execute(input: GetMonthlyExpensesDistributionInput): GetMonthlyExpensesDistributionOutput
}

@injectable()
export class GetMonthlyExpensesDistributionForUser implements GetMonthlyExpensesDistributionForUserUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: GetMonthlyExpensesDistributionInput): GetMonthlyExpensesDistributionOutput {
    const { userId, month, year } = input
    const transactions = await this._transactionRepository.findManyByUserAndFilters(userId, { date: { month, year } })

    let totalIncome = 0
    let totalExpensesForNecessity = 0
    let totalExpensesForLuxury = 0
    let totalExpensesForSavings = 0

    for (const transaction of transactions) {
      const spendingType = transaction.category?.spendingType
      if (!spendingType) {
        console.error(`Spending type not found for category ${transaction.category?.id}`)
        throw new InternalServerError("Spending type not found")
      }

      if (isIncome(transaction.type)) {
        totalIncome += transaction.amount
        continue
      }

      if (isNecessity(spendingType)) {
        totalExpensesForNecessity += transaction.amount
      } else if (isLuxury(spendingType)) {
        totalExpensesForLuxury += transaction.amount
      } else if (isSavings(spendingType)) {
        totalExpensesForSavings += transaction.amount
      } else {
        console.error(`Unknown spending type ${spendingType}. Skipping...`)
      }
    }

    const expensesDistribution = {
      [SpendingType.NECESSITY]: {
        total: totalExpensesForNecessity,
        percentage: totalIncome > 0 ? calculatePercentageFromTotal(totalIncome, totalExpensesForNecessity) : 0,
      },
      [SpendingType.LUXURY]: {
        total: totalExpensesForLuxury,
        percentage: totalIncome > 0 ? calculatePercentageFromTotal(totalIncome, totalExpensesForLuxury) : 0,
      },
      [SpendingType.SAVINGS]: {
        total: totalExpensesForSavings,
        percentage: totalIncome > 0 ? calculatePercentageFromTotal(totalIncome, totalExpensesForSavings) : 0,
      },
    }

    return { totalIncome, expensesDistribution }
  }
}
