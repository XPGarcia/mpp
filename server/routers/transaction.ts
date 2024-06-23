import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { createTransaction } from "@/src/transactions/actions/create-transaction"
import { calculateBalance } from "@/src/transactions/actions/calculate-balance"

export const transactionRouter = router({
  findManyByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const transactions = await TransactionRepository.findAllByUserId(ctx.user.id)
    return transactions
  }),
  createOne: privateProcedure
    .input(
      z.object({
        date: z.date(),
        amount: z.number().min(0),
        categoryId: z.number().min(1),
        typeId: z.number().min(1),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { date, amount, categoryId, typeId, description } = input
      const createdTransaction = await createTransaction({
        userId: ctx.user.id,
        date,
        amount,
        categoryId,
        typeId,
        description,
      })
      return createdTransaction
    }),
  getUserTransactionsWithBalance: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const transactions = await TransactionRepository.findAllByUserId(ctx.user.id)
    const balance = calculateBalance(transactions)
    return { balance, transactions }
  }),
  test: privateProcedure.input(z.object({})).query(async () => {
    return [10, 20, 30]
  }),
})
