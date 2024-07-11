import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { getMonthlyExpensesDistributionForUser } from "@/src/accounts/actions/get-monthly-expenses-distribution"
import { BudgetRepository } from "@/src/accounts/repositories/budget-repository"

export const budgetRouter = router({
  getMonthlyExpensesDistribution: privateProcedure
    .input(z.object({ month: z.string(), year: z.string() }))
    .query(async ({ input, ctx }) => {
      const { month, year } = input
      const monthlyExpensesDistribution = await getMonthlyExpensesDistributionForUser({
        userId: ctx.user.id,
        month,
        year,
      })
      return monthlyExpensesDistribution
    }),
  findOneByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const budget = await BudgetRepository.findOneByUserId(ctx.user.id)
    return budget
  }),
})
