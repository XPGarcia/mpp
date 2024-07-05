import { db } from "@/db"
import { Category } from "../types"
import { categories } from "@/db/schema"
import { and, asc, eq, isNull, or } from "drizzle-orm"
import { TransactionType } from "@/src/transactions/types"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"

type UpdateCategoryInput = {
  transactionType: TransactionType
  name: string
}

type CreateCategoryInput = Omit<typeof categories.$inferInsert, "transactionTypeId"> & {
  transactionType: TransactionType
}

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
      .orderBy(asc(categories.name))
  }

  static async createForUser(values: CreateCategoryInput): Promise<Category> {
    const transactionTypeId = getTransactionTypeId(values.transactionType)
    const createdCategories = await db
      .insert(categories)
      .values({ ...values, transactionTypeId })
      .returning()
    return createdCategories[0]
  }

  static async createManyForUser(values: CreateCategoryInput[]): Promise<Category[]> {
    const mappedValues = values.map((value) => ({
      ...value,
      transactionTypeId: getTransactionTypeId(value.transactionType),
    }))
    const createdCategories = await db.insert(categories).values(mappedValues).returning()
    return createdCategories
  }

  static async findOneById(categoryId: number): Promise<Category | undefined> {
    return await db.query.categories.findFirst({ where: eq(categories.id, categoryId) })
  }

  static async updateOne(categoryId: number, values: UpdateCategoryInput): Promise<Category> {
    const { name, transactionType } = values
    const transactionTypeId = getTransactionTypeId(transactionType)
    const updatedCategories = await db
      .update(categories)
      .set({ name, transactionTypeId })
      .where(eq(categories.id, categoryId))
      .returning()
    return updatedCategories[0]
  }

  static async deleteOne(categoryId: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, categoryId))
  }
}
