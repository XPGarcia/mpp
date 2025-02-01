import { categories } from "@/db/schema"

import { Category, WithSpend } from "@/modules/transactions/domain"
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

  static toDomainWithSpend(dbCategory?: DrizzleCategory & { totalSpend: number }): WithSpend<Category> | undefined {
    if (!dbCategory) {
      return
    }

    return {
      id: dbCategory.id,
      name: dbCategory.name,
      transactionType: getTransactionTypeFromId(dbCategory.transactionTypeId),
      spendingType: getSpendingTypeFromId(dbCategory.spendingTypeId),
      totalSpend: dbCategory.totalSpend,
    }
  }

  static toDomainsWithSpend(dbCategories: (DrizzleCategory & { totalSpend: number })[]): WithSpend<Category>[] {
    return dbCategories
      .map((dbCategory) => this.toDomainWithSpend(dbCategory))
      .filter((category) => !!category) as WithSpend<Category>[]
  }
}
