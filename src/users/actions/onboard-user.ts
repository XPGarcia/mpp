import { BadRequestError } from "@/src/utils/errors/errors"
import { UserRepository } from "../repositories/user-repository"
import { AccountRepository } from "@/src/accounts/repositories/account-repository"
import { BudgetRepository } from "@/src/accounts/repositories/budget-repository"
import { CategoryRepository } from "@/src/categories/repositories/category-repository"
import { createInitialCategoriesForUser } from "@/src/categories/actions/create-initial-categories-for-user"

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
  const createdAccount = await AccountRepository.create({
    userId: input.userId,
    name: input.account.name,
    balance: input.account.startingBalance,
    currency: input.account.currency as string,
  })
  if (!createdAccount) {
    throw new BadRequestError("Failed to create account")
  }

  const createdBudget = await BudgetRepository.create({
    ...input.budget,
    userId: input.userId,
  })
  if (!createdBudget) {
    throw new BadRequestError("Failed to create budget")
  }

  await createInitialCategoriesForUser(input.userId)

  const updatedUser = await UserRepository.update(input.userId, { onboardedAt: new Date() })
  if (!updatedUser) {
    throw new BadRequestError("User not found")
  }
}
