import { faker } from "@faker-js/faker"

import { Category, SpendingType, TransactionType } from "@/modules/transactions/domain"
import { generateEntityFromMock } from "@/utils"

const CATEGORY_MOCK: Category = {
  id: faker.number.int(),
  name: faker.commerce.productMaterial(),
  transactionType: TransactionType.EXPENSE,
  spendingType: SpendingType.NECESSITY,
}

export const generateCategoryFromMock = generateEntityFromMock(CATEGORY_MOCK)
