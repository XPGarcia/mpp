import { faker } from "@faker-js/faker"

import { RecurrentTransaction, TransactionFrequency, TransactionType } from "@/modules/transactions/domain"
import { generateEntityFromMock } from "@/utils"

const RECURRENT_TRANSACTION_MOCK: RecurrentTransaction = {
  id: faker.number.int(),
  userId: faker.number.int(),
  accountId: faker.number.int(),
  amount: faker.number.float(),
  categoryId: faker.number.int(),
  date: new Date(),
  type: TransactionType.EXPENSE,
  description: faker.lorem.sentence(),
  frequency: TransactionFrequency.DAILY,
  startDate: new Date(),
  nextDate: new Date(),
}

export const generateRecurrentTransactionMock = generateEntityFromMock(RECURRENT_TRANSACTION_MOCK)
