import { db } from "@/db"
import { Transaction, TransactionType } from "../types"
import { categories, transactionTypes, transactions } from "@/db/schema"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { TransactionMapper } from "./transaction-mapper"

type CreateTransactionInput = typeof transactions.$inferInsert
type UpdateTransactionInput = Partial<CreateTransactionInput>

export class TransactionRepository {
  static async createOne(input: CreateTransactionInput): Promise<Transaction> {
    const rows = await db.insert(transactions).values(input).returning()
    return TransactionMapper.toDomain(rows[0])
  }

  static async findOneById(transactionId: number): Promise<Transaction | undefined> {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
    return transaction ? TransactionMapper.toDomain(transaction) : undefined
  }

  static async findAllByUserId(userId: number): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
    return rows.map(TransactionMapper.toDomain)
  }

  static async findManyByUserIdAndMonthRange(
    userId: number,
    options: { month: string; year: string }
  ): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(
        and(
          eq(transactions.userId, userId),
          sql`EXTRACT(YEAR FROM ${transactions.date}) = ${options.year}`,
          sql`EXTRACT(MONTH FROM ${transactions.date}) = ${options.month}`
        )
      )
      .orderBy(desc(transactions.date))
    return rows.map(TransactionMapper.toDomain)
  }

  static async updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined> {
    const updatedTransaction = await db
      .update(transactions)
      .set(input)
      .where(eq(transactions.id, transactionId))
      .returning()
    return updatedTransaction.length > 0 ? TransactionMapper.toDomain(updatedTransaction[0]) : undefined
  }

  static async countByCategoryId(categoryId: number): Promise<number> {
    const rows = await db
      .select({ count: count(transactions.id) })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId))
    return rows[0]?.count ?? 0
  }
}
