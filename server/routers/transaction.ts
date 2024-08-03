import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { TransactionRepository } from "@/src/transactions/repositories/transaction-repository"
import { createTransaction } from "@/src/transactions/actions/create-transaction"
import { calculateBalance } from "@/src/transactions/actions/calculate-balance"
import { TRPCError } from "@trpc/server"
import { updateTransaction } from "@/src/transactions/actions/update-transaction"
import { getValues } from "@/src/utils/format/zod-enums"
import { TransactionFrequency, TransactionType } from "@/src/transactions/types"
import { deleteTransaction } from "@/src/transactions/actions/delete-transaction"

export const transactionRouter = router({
  findOneById: privateProcedure
    .input(z.object({ id: z.number(), withRecurrentTransaction: z.boolean().default(false) }))
    .query(async ({ input }) => {
      const transaction = await TransactionRepository.findOneById(input.id)
      if (!transaction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" })
      }
      if (input.withRecurrentTransaction) {
        const recurrentTransaction = await TransactionRepository.findRecurrentByParentId(transaction.id)
        if (!!recurrentTransaction) {
          transaction.isRecurrent = true
          transaction.frequency = recurrentTransaction.frequency
        }
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
        isRecurrent: z.boolean(),
        frequency: z.enum(getValues(TransactionFrequency)).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdTransaction = await createTransaction({
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
      const createdTransaction = await updateTransaction(input)
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
  deleteOne: privateProcedure.input(z.object({ transactionId: z.number() })).mutation(async ({ input }) => {
    await deleteTransaction({ transactionId: input.transactionId })
  }),
})
