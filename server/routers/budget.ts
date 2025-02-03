import { z } from "zod"

import { budgetsClient } from "@/modules/accounts"
import { transactionsClient } from "@/modules/transactions"

import { privateProcedure, router } from "../trpc"

export const budgetRouter = router({
  getMonthlyExpensesDistribution: privateProcedure
    .input(z.object({ month: z.string(), year: z.string() }))
    .query(async ({ input, ctx }) => {
      const { month, year } = input
      const monthlyExpensesDistribution = await transactionsClient.getMonthlyExpensesDistributionForUser({
        userId: ctx.user.id,
        month,
        year,
      })
      return monthlyExpensesDistribution
    }),
  findOneByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const budget = await budgetsClient.findOneByUserId({ userId: ctx.user.id })
    return budget
  }),
})
