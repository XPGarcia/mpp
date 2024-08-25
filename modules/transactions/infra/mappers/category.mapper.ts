import { categories } from "@/db/schema"

import { getTransactionTypeFromId } from "@/src/utils/get-transaction-type-id"
import { getSpendingTypeFromId } from "@/src/utils/get-spending-type-id"
import { Category } from "@/modules/transactions/domain"

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
    return dbCategories.map((dbCategory) => this.toDomain(dbCategory)).filter((category) => !!category)
  }
}
