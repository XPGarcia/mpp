import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { calculateBalance } from "@/modules/transactions/utils"
import { TRPCError } from "@trpc/server"
import { getValues } from "@/src/utils/format/zod-enums"
import { transactionsClient } from "@/modules/transactions"
import { TransactionFrequency, TransactionType } from "@/modules/transactions/types"

export const transactionRouter = router({
  findOneById: privateProcedure
    .input(z.object({ id: z.number(), withRecurrentTransaction: z.boolean().default(false) }))
    .query(async ({ input }) => {
      const transaction = await transactionsClient.findOne({
        transactionId: input.id,
        withRecurrentTransaction: input.withRecurrentTransaction,
      })
      if (!transaction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" })
      }
      return transaction
    }),
  findManyByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const transactions = await transactionsClient.findManyByUser({ userId: ctx.user.id })
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
        isRecurrent: z.boolean(),
        frequency: z.enum(getValues(TransactionFrequency)).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdTransaction = await transactionsClient.createOne({
        userId: ctx.user.id,
        ...input,
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
        isRecurrent: z.boolean(),
        frequency: z.enum(getValues(TransactionFrequency)).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const createdTransaction = await transactionsClient.updateOne(input)
      return createdTransaction
    }),
  getUserTransactionsWithBalance: privateProcedure
    .input(z.object({ month: z.string(), year: z.string() }))
    .query(async ({ input, ctx }) => {
      const transactions = await transactionsClient.findManyByUserAndMonth({
        userId: ctx.user.id,
        date: input,
      })
      const balance = calculateBalance(transactions)
      return { balance, transactions }
    }),
  deleteOne: privateProcedure.input(z.object({ transactionId: z.number() })).mutation(async ({ input }) => {
    await transactionsClient.deleteOne({ transactionId: input.transactionId })
  }),
})
