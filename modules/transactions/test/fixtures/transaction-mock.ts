import { faker } from "@faker-js/faker"

import { Transaction, TransactionType } from "@/modules/transactions/domain"
import { generateEntityFromMock } from "@/utils"

const TRANSACTION_MOCK: Transaction = {
  id: faker.number.int(),
  userId: faker.number.int(),
  accountId: faker.number.int(),
  amount: faker.number.float(),
  categoryId: faker.number.int(),
  date: new Date(),
  type: TransactionType.EXPENSE,
  description: faker.lorem.sentence(),
  createdAt: new Date(),
}

export const generateTransactionMock = generateEntityFromMock(TRANSACTION_MOCK)
