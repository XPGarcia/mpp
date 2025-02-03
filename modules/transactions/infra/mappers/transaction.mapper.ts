import { categories, transactions,transactionTypes } from "@/db/schema"
import { Transaction, TransactionType } from "@/modules/transactions/domain"

import { getTransactionTypeFromId } from "../utils"
import { CategoryMapper } from "./category.mapper"

type DrizzleTransactionWithRelations = {
  Transaction: typeof transactions.$inferSelect
  Category: typeof categories.$inferSelect | null
  TransactionType: typeof transactionTypes.$inferSelect | null
}

type DrizzleTransaction = typeof transactions.$inferSelect

export class TransactionMapper {
  static toDomain(dbTransaction?: DrizzleTransaction | DrizzleTransactionWithRelations): Transaction | undefined {
    if (!dbTransaction) {
      return
    }

    if ("id" in dbTransaction) {
      return singleToDomain(dbTransaction)
    }

    const transaction = singleToDomain(dbTransaction.Transaction)

    if (dbTransaction.Category) {
      transaction.category = CategoryMapper.toDomain(dbTransaction.Category)
    }

    if (dbTransaction.TransactionType) {
      transaction.type = dbTransaction.TransactionType.name as TransactionType
    }

    return transaction
  }

  static toDomains(dbTransactions: (DrizzleTransaction | DrizzleTransactionWithRelations)[]): Transaction[] {
    return dbTransactions
      .map((dbTransaction) => this.toDomain(dbTransaction))
      .filter((transaction) => !!transaction) as Transaction[]
  }
}

function singleToDomain(dbTransaction: DrizzleTransaction): Transaction {
  return {
    id: dbTransaction.id,
    userId: dbTransaction.userId,
    accountId: dbTransaction.accountId,
    date: dbTransaction.date,
    amount: dbTransaction.amount,
    type: getTransactionTypeFromId(dbTransaction.typeId),
    categoryId: dbTransaction.categoryId,
    description: dbTransaction.description ?? undefined,
    isRecurrent: false,
  }
}
