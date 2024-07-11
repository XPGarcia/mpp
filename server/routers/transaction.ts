import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { createTransaction } from "@/src/transactions/actions/create-transaction"
import { calculateBalance } from "@/src/transactions/actions/calculate-balance"
import { TRPCError } from "@trpc/server"
import { updateTransaction } from "@/src/transactions/actions/update-transaction"
import { getValues } from "@/src/utils/format/zod-enums"
import { TransactionType } from "@/src/transactions/types"

export const transactionRouter = router({
  findOneById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const transaction = await TransactionRepository.findOneById(input.id)
    if (!transaction) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" })
    }
    return transaction
  }),
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
        type: z.enum(getValues(TransactionType)),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { date, amount, categoryId, type, description } = input
      const createdTransaction = await createTransaction({
        userId: ctx.user.id,
        date,
        amount,
        categoryId,
        type,
        description,
      })
      return createdTransaction
    }),
  updateOne: privateProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
        amount: z.number().min(0),
        categoryId: z.number().min(1),
        type: z.enum(getValues(TransactionType)),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, date, amount, categoryId, type, description } = input
      const createdTransaction = await updateTransaction({
        id,
        date,
        amount,
        categoryId,
        type,
        description,
      })
      return createdTransaction
    }),
  getUserTransactionsWithBalance: privateProcedure
    .input(z.object({ month: z.string(), year: z.string() }))
    .query(async ({ input, ctx }) => {
      const { month, year } = input
      const transactions = await TransactionRepository.findManyByUserIdAndMonthRange(ctx.user.id, { month, year })
      const balance = calculateBalance(transactions)
      return { balance, transactions }
    }),
})
