import { categories } from "@/db/schema"
import { Category } from "../types"
import { getTransactionTypeFromId } from "@/src/utils/get-transaction-type-id"
import { getSpendingTypeFromId } from "@/src/utils/get-spending-type-id"

type DrizzleCategory = typeof categories.$inferSelect

export class CategoryMapper {
  static toDomain(dbCategory: DrizzleCategory): Category {
    return {
      id: dbCategory.id,
      name: dbCategory.name,
      transactionType: getTransactionTypeFromId(dbCategory.transactionTypeId),
      spendingType: getSpendingTypeFromId(dbCategory.spendingTypeId),
    }
  }
}
