import { categories } from "@/db/schema"

import { Category } from "@/modules/transactions/domain"
import { getSpendingTypeFromId, getTransactionTypeFromId } from "../utils"

type DrizzleCategory = typeof categories.$inferSelect

export class CategoryMapper {
  static toDomain(dbCategory?: DrizzleCategory): Category | undefined {
    if (!dbCategory) {
      return
    }

    return {
      id: dbCategory.id,
      name: dbCategory.name,
      transactionType: getTransactionTypeFromId(dbCategory.transactionTypeId),
      spendingType: getSpendingTypeFromId(dbCategory.spendingTypeId),
    }
  }

  static toDomains(dbCategories: DrizzleCategory[]): Category[] {
    return dbCategories.map((dbCategory) => this.toDomain(dbCategory)).filter((category) => !!category) as Category[]
  }
}
