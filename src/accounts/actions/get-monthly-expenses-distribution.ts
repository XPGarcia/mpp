import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { BudgetRepository } from "../repositories/budget-repository"
import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { isIncome } from "@/src/utils/get-transaction-type-id"
import { isLuxury, isNecessity, isSavings } from "@/src/utils/get-spending-type-id"
import { SpendingType } from "@/src/transactions/types"

interface GetMonthlyStatisticsForUserInput {
  userId: number
  month: string
  year: string
}

const calculatePercentageFromTotal = (total: number, amount: number) => {
  const percentage = (amount * 100) / total
  return Math.round(percentage)
}

export const getMonthlyExpensesDistributionForUser = async (input: GetMonthlyStatisticsForUserInput) => {
  const { userId, month, year } = input
  const transactions = await TransactionRepository.findManyByUserIdAndMonthRange(userId, { month, year })

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
      percentage: calculatePercentageFromTotal(totalIncome, totalExpensesForNecessity),
    },
    [SpendingType.LUXURY]: {
      total: totalExpensesForLuxury,
      percentage: calculatePercentageFromTotal(totalIncome, totalExpensesForLuxury),
    },
    [SpendingType.SAVINGS]: {
      total: totalExpensesForSavings,
      percentage: calculatePercentageFromTotal(totalIncome, totalExpensesForSavings),
    },
  }

  return { totalIncome, expensesDistribution }
}
