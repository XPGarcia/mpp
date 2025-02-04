import { z } from "zod"

import { accountBalanceEntriesClient, accountsClient, budgetsClient } from "@/modules/accounts"
import { categoriesClient } from "@/modules/transactions"
import { usersClient } from "@/modules/users"
import { BadRequestError } from "@/src/utils/errors/errors"

import { privateProcedure, publicProcedure, router } from "../trpc"

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
      const user = await usersClient.createOne({ firstName, lastName, email, password })
      await usersClient.sendVerificationEmail({ userId: user.id })
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
  resendOTP: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id
    return await usersClient.sendVerificationEmail({ userId })
  }),
  verifyOTP: privateProcedure.input(z.object({ code: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.user.id
    return await usersClient.verifyOTP({
      userId,
      code: input.code,
    })
  }),
})
