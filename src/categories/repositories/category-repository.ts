import { db } from "@/db"
import { Category } from "../types"
import { categories } from "@/db/schema"
import { and, eq, isNull, or } from "drizzle-orm"
import { TransactionType } from "@/src/transactions/types"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"

export class CategoryRepository {
  static async getUserCategoriesByTransaction({
    userId,
    transactionType,
  }: {
    userId: number
    transactionType: TransactionType
  }): Promise<Category[]> {
    const transactionTypeId = getTransactionTypeId(transactionType)

    return await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(
        and(
          or(eq(categories.userId, userId), isNull(categories.userId)),
          eq(categories.transactionTypeId, transactionTypeId)
        )
      )
  }

  static async createForUser({
    userId,
    transactionType,
    name,
  }: {
    userId: number
    transactionType: TransactionType
    name: string
  }): Promise<Category> {
    const transactionTypeId = getTransactionTypeId(transactionType)
    console.log("transactionTypeId", transactionTypeId)

    const createdCategories = await db.insert(categories).values({ userId, transactionTypeId, name }).returning()
    return createdCategories[0]
  }
}
