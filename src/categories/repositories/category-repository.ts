import { db } from "@/db"
import { Category } from "../types"
import { categories } from "@/db/schema"
import { and, eq, isNull, or } from "drizzle-orm"

export class CategoryRepository {
  static async getUserCategoriesByTransaction({
    userId,
    transactionTypeId,
  }: {
    userId: number
    transactionTypeId: number
  }): Promise<Category[]> {
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
}
