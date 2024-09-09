import { Account } from "@/modules/accounts/domain"
import { generateEntityFromMock } from "@/utils"
import { faker } from "@faker-js/faker"

const ACCOUNT_MOCK: Account = {
  id: faker.number.int(),
  userId: faker.number.int(),
  balance: faker.number.float(),
  name: faker.person.fullName(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const generateAccountMock = generateEntityFromMock(ACCOUNT_MOCK)
