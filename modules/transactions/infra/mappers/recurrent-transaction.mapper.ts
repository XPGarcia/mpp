import { accounts, categories, recurrentTransactions, transactions } from "@/db/schema"
import { RecurrentTransaction } from "@/modules/transactions/domain"

import { getTransactionFrequencyFromId, getTransactionTypeFromId } from "../utils"
import { CategoryMapper } from "./category.mapper"
import { TransactionMapper } from "./transaction.mapper"

type DrizzleRecurrentTransaction = typeof recurrentTransactions.$inferSelect & {
  account?: typeof accounts.$inferSelect
  category?: typeof categories.$inferSelect
  transactions?: (typeof transactions.$inferSelect)[]
}

type DrizzleRecurrentTransactionWithRelations = {
  RecurrentTransaction: DrizzleRecurrentTransaction
  Category: typeof categories.$inferSelect | null
  Account?: typeof accounts.$inferSelect | null
}

export class RecurrentTransactionMapper {
  static toDomain(
    dbRecurrentTransaction?: DrizzleRecurrentTransaction | DrizzleRecurrentTransactionWithRelations
  ): RecurrentTransaction | undefined {
    if (!dbRecurrentTransaction) {
      return
    }

    if ("id" in dbRecurrentTransaction) {
      return singleToDomain(dbRecurrentTransaction)
    }

    const recurrentTransaction = singleToDomain(dbRecurrentTransaction.RecurrentTransaction)

    if (dbRecurrentTransaction.Category) {
      recurrentTransaction.category = CategoryMapper.toDomain(dbRecurrentTransaction.Category)
    }

    if (dbRecurrentTransaction.Account) {
      recurrentTransaction.account = {
        id: dbRecurrentTransaction.Account.id,
        name: dbRecurrentTransaction.Account.name,
      }
    }

    return recurrentTransaction
  }

  static toDomains(
    dbRecurrentTransactions: (DrizzleRecurrentTransaction | DrizzleRecurrentTransactionWithRelations)[]
  ): RecurrentTransaction[] {
    return dbRecurrentTransactions
      .map((dbRecurrentTransaction) => this.toDomain(dbRecurrentTransaction))
      .filter((recurrentTransaction) => !!recurrentTransaction) as RecurrentTransaction[]
  }
}

function singleToDomain(dbRecurrentTransaction: DrizzleRecurrentTransaction): RecurrentTransaction {
  return {
    id: dbRecurrentTransaction.id,
    userId: dbRecurrentTransaction.userId,
    accountId: dbRecurrentTransaction.accountId,
    date: dbRecurrentTransaction.date,
    amount: dbRecurrentTransaction.amount,
    type: getTransactionTypeFromId(dbRecurrentTransaction.typeId),
    categoryId: dbRecurrentTransaction.categoryId,
    description: dbRecurrentTransaction.description ?? undefined,
    frequency: getTransactionFrequencyFromId(dbRecurrentTransaction.frequencyId),
    startDate: dbRecurrentTransaction.startDate,
    nextDate: dbRecurrentTransaction.nextDate,
    account: dbRecurrentTransaction.account
      ? { id: dbRecurrentTransaction.account.id, name: dbRecurrentTransaction.account.name }
      : undefined,
    category: CategoryMapper.toDomain(dbRecurrentTransaction.category),
    transactions: dbRecurrentTransaction.transactions
      ? TransactionMapper.toDomains(dbRecurrentTransaction.transactions)
      : undefined,
  }
}
