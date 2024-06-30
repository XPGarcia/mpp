import { db } from "@/db"
import { Transaction, TransactionType } from "../types"
import { categories, transactionTypes, transactions } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

type CreateTransactionInput = typeof transactions.$inferInsert
type UpdateTransactionInput = Partial<CreateTransactionInput>

export class TransactionRepository {
  static async createOne(input: CreateTransactionInput): Promise<Transaction> {
    const rows = await db.insert(transactions).values(input).returning()
    return rows[0]
  }

  static async findOneById(transactionId: number): Promise<Transaction | undefined> {
    return await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
  }

  static async findAllByUserId(userId: number): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))

    return rows.map((row) => {
      if (!row.Category || !row.TransactionType) {
        throw new Error("Failed to find transaction")
      }

      const transaction: Transaction = {
        id: row.Transaction.id,
        date: row.Transaction.date,
        amount: row.Transaction.amount,
        typeId: row.Transaction.typeId,
        categoryId: row.Transaction.categoryId,
        description: row.Transaction.description,
      }

      if (row.Category) {
        transaction.category = {
          id: row.Category.id,
          name: row.Category.name,
        }
      }

      if (row.TransactionType) {
        transaction.type = row.TransactionType.name as TransactionType
      }

      return transaction
    })
  }

  static async updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined> {
    const updatedTransaction = await db
      .update(transactions)
      .set(input)
      .where(eq(transactions.id, transactionId))
      .returning()
    return updatedTransaction.length > 0 ? updatedTransaction[0] : undefined
  }
}
