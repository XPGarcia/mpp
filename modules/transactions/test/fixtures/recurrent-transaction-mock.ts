import { faker } from "@faker-js/faker"

import { RecurrentTransaction, TransactionFrequency } from "@/modules/transactions/domain"
import { generateEntityFromMock } from "@/utils"

const RECURRENT_TRANSACTION_MOCK: RecurrentTransaction = {
  id: faker.number.int(),
  transactionId: faker.number.int(),
  frequency: TransactionFrequency.DAILY,
  startDate: new Date(),
  nextDate: new Date(),
}

export const generateRecurrentTransactionMock = generateEntityFromMock(RECURRENT_TRANSACTION_MOCK)
