import { SpendingType, Transaction, TransactionType } from "@/src/transactions/types"
import { CategoryRepository } from "../repositories/category-repository"
import { Category } from "../types"
import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { getTransactionTypeId, isExpense, isIncome } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import {
  calculateAmountFromExpenseToIncome,
  calculateAmountFromIncomeToExpense,
} from "@/src/transactions/actions/calculate-amount-for-balance"
import dayjs from "dayjs"
import { AccountBalanceEntryRepository } from "@/src/accounts/repositories/account-balance-entry-repository"
import { updateAmountAccountBalanceEntry } from "@/src/accounts/actions/update-amount-account-balance-entry"

const groupTransactionsByDate = (transactions: Transaction[]): { [key: string]: Transaction[] } => {
  const groupedTransactionsByDate: { [key: string]: Transaction[] } = {}

  for (const transaction of transactions ?? []) {
    const formattedDate = dayjs(transaction.date).format("YYYY-MM")
    if (!groupedTransactionsByDate[formattedDate]) {
      groupedTransactionsByDate[formattedDate] = []
    }
    groupedTransactionsByDate[formattedDate].push(transaction)
  }

  return groupedTransactionsByDate
}

interface UpdateCategoryInput {
  categoryId: number
  transactionType: TransactionType
  spendingType: SpendingType
  name: string
}

export const updateOneCategory = async (input: UpdateCategoryInput): Promise<Category> => {
  const { categoryId, transactionType, spendingType, name } = input
  const oldCategory = await CategoryRepository.findOneById(categoryId)
  if (!oldCategory) {
    throw new NotFoundError("Category not found")
  }

  const updatedCategory = await CategoryRepository.updateOne(oldCategory.id, {
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

  await TransactionRepository.updateManyByCategoryId(updatedCategory.id, {
    typeId: getTransactionTypeId(updatedCategory.transactionType),
  })

  const transactions = await TransactionRepository.findAllByCategoryId(updatedCategory.id)
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

    const accountBalanceEntry = await AccountBalanceEntryRepository.findOneByAccountAndDate(
      transactionsByDate[0].accountId,
      new Date(`${year}-${month}-15`) // search in the middle of the month
    )
    if (!accountBalanceEntry) {
      throw new NotFoundError("Account balance entry not found")
    }

    await updateAmountAccountBalanceEntry({ accountBalanceEntry, amount })
  }

  return updatedCategory
}
