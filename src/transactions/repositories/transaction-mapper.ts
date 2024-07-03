import { categories, transactionTypes, transactions } from "@/db/schema"
import { Transaction, TransactionType } from "../types"

type DrizzleTransactionWithRelations = {
  Transaction: typeof transactions.$inferSelect
  Category: typeof categories.$inferSelect | null
  TransactionType: typeof transactionTypes.$inferSelect | null
}

type DrizzleTransaction = typeof transactions.$inferSelect

export class TransactionMapper {
  static toDomain(dbTransaction: DrizzleTransaction | DrizzleTransactionWithRelations): Transaction {
    if ("id" in dbTransaction) {
      return singleToDomain(dbTransaction)
    }

    const transaction = singleToDomain(dbTransaction.Transaction)

    if (dbTransaction.Category) {
      transaction.category = {
        id: dbTransaction.Category.id,
        name: dbTransaction.Category.name,
      }
    }

    if (dbTransaction.TransactionType) {
      transaction.type = dbTransaction.TransactionType.name as TransactionType
    }

    return transaction
  }
}

function singleToDomain(dbTransaction: DrizzleTransaction): Transaction {
  return {
    id: dbTransaction.id,
    date: dbTransaction.date,
    amount: dbTransaction.amount,
    typeId: dbTransaction.typeId,
    categoryId: dbTransaction.categoryId,
    description: dbTransaction.description,
  }
}
