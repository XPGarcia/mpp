import { AccountBalanceEntry } from "@/modules/accounts/domain"
import { generateEntityFromMock } from "@/utils"
import { faker } from "@faker-js/faker"

const ACCOUNT_BALANCE_ENTRY_MOCK: AccountBalanceEntry = {
  id: faker.number.int(),
  accountId: faker.number.int(),
  amount: faker.number.float(),
}

export const generateAccountBalanceEntryMock = generateEntityFromMock(ACCOUNT_BALANCE_ENTRY_MOCK)
