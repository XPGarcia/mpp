import { z } from "zod"
import { publicProcedure, privateProcedure, router } from "../trpc"
import { usersClient } from "@/modules/users"
import { accountBalanceEntriesClient, accountsClient, budgetsClient } from "@/modules/accounts"
import { BadRequestError } from "@/src/utils/errors/errors"
import { categoriesClient } from "@/modules/transactions"

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { firstName, lastName, email, password } = input
      await usersClient.createOne({ firstName, lastName, email, password })
      return { firstName, lastName, email }
    }),
  onboardUser: privateProcedure
    .input(
      z.object({
        account: z.object({
          name: z.string(),
          startingBalance: z.number(),
          currency: z.literal("USD"),
        }),
        budget: z.object({
          name: z.string(),
          living: z.number(),
          savings: z.number(),
          entertainment: z.number(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id
      const { account, budget } = input
      const createdAccount = await accountsClient.createOne({
        userId,
        name: account.name,
        balance: account.startingBalance,
        currency: account.currency as string,
      })
      if (!createdAccount) {
        throw new BadRequestError("Failed to create account")
      }

      const createdAccountBalanceEntry = await accountBalanceEntriesClient.createOne({
        accountId: createdAccount.id,
        amount: account.startingBalance,
        description: "Initial balance",
      })
      if (!createdAccountBalanceEntry) {
        throw new BadRequestError("Failed to create account balance entry")
      }

      const createdBudget = await budgetsClient.createOne({
        ...budget,
        userId,
      })
      if (!createdBudget) {
        throw new BadRequestError("Failed to create budget")
      }

      await categoriesClient.createInitialCategoriesForUser({ userId })

      const updatedUser = await usersClient.updateOne({ userId, data: { onboardedAt: new Date() } })
      if (!updatedUser) {
        throw new BadRequestError("User not found")
      }
    }),
})
