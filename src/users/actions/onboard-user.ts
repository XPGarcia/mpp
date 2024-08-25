import { BadRequestError } from "@/src/utils/errors/errors"
import { UserRepository } from "../repositories/user-repository"
import { categoriesClient } from "@/modules/transactions"
import { accountBalanceEntriesClient, accountsClient, budgetsClient } from "@/modules/accounts"

interface OnboardUserInput {
  userId: number
  account: {
    name: string
    startingBalance: number
    currency: "USD"
  }
  budget: {
    name: string
    living: number
    savings: number
    entertainment: number
  }
}

export const onboardUser = async (input: OnboardUserInput): Promise<void> => {
  const createdAccount = await accountsClient.createOne({
    userId: input.userId,
    name: input.account.name,
    balance: input.account.startingBalance,
    currency: input.account.currency as string,
  })
  if (!createdAccount) {
    throw new BadRequestError("Failed to create account")
  }

  const createdAccountBalanceEntry = await accountBalanceEntriesClient.createOne({
    accountId: createdAccount.id,
    amount: input.account.startingBalance,
    description: "Initial balance",
  })
  if (!createdAccountBalanceEntry) {
    throw new BadRequestError("Failed to create account balance entry")
  }

  const createdBudget = await budgetsClient.createOne({
    ...input.budget,
    userId: input.userId,
  })
  if (!createdBudget) {
    throw new BadRequestError("Failed to create budget")
  }

  await categoriesClient.createInitialCategoriesForUser({ userId: input.userId })

  const updatedUser = await UserRepository.update(input.userId, { onboardedAt: new Date() })
  if (!updatedUser) {
    throw new BadRequestError("User not found")
  }
}
