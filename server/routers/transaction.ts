import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { transactionsClient } from "@/modules/transactions"
import { TransactionFrequency, TransactionType } from "@/modules/transactions/types"
import { calculateBalance } from "@/modules/transactions/utils"
import { getValues } from "@/src/utils/format/zod-enums"

import { privateProcedure, router } from "../trpc"

export const transactionRouter = router({
  findOneById: privateProcedure
    .input(z.object({ id: z.number(), withRecurrentTransaction: z.boolean().default(false) }))
    .query(async ({ input }) => {
      const transaction = await transactionsClient.findOne({ transactionId: input.id })
      if (!transaction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" })
      }
      return transaction
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
      const updatedTransaction = await transactionsClient.updateOne(input)
      return updatedTransaction
    }),
  findUserTransactionsWithBalance: privateProcedure
    .input(
      z.object({
        categoriesIds: z.array(z.number()),
        date: z.object({ month: z.string(), year: z.string() }),
      })
    )
    .query(async ({ input, ctx }) => {
      const { categoriesIds, date } = input
      const transactions = await transactionsClient.findUserTransactions({
        userId: ctx.user.id,
        filters: { categoriesIds, date },
      })
      const balance = calculateBalance(transactions)
      return { balance, transactions }
    }),
  deleteOne: privateProcedure.input(z.object({ transactionId: z.number() })).mutation(async ({ input }) => {
    await transactionsClient.deleteOne({ transactionId: input.transactionId })
  }),
  getFilteredBalances: privateProcedure
    .input(
      z.object({
        categoriesIds: z.array(z.number()),
        date: z.object({ month: z.string(), year: z.string() }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { categoriesIds, date } = input
      const totalTransactions = await transactionsClient.findUserTransactions({
        userId: ctx.user.id,
        filters: { date },
      })
      const totalBalance = calculateBalance(totalTransactions)
      const filteredTransactions = await transactionsClient.findUserTransactions({
        userId: ctx.user.id,
        filters: { categoriesIds, date },
      })
      const filteredBalance = calculateBalance(filteredTransactions)
      return { totalBalance, filteredBalance }
    }),
  findUserRecurrentTransactions: privateProcedure.query(async ({ ctx }) => {
    const recurrentTransactions = await transactionsClient.findUserRecurrentTransactions({ userId: ctx.user.id })
    return recurrentTransactions
  }),
  findOneRecurrentById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const recurrentTransaction = await transactionsClient.findRecurrentTransaction({
      recurrentTransactionId: input.id,
      options: { withTransactions: true },
    })
    return recurrentTransaction
  }),
  deleteRecurrentTransaction: privateProcedure
    .input(z.object({ recurrentTransactionId: z.number() }))
    .mutation(async ({ input }) => {
      const { recurrentTransactionId } = input
      await transactionsClient.deleteRecurrentTransaction({ recurrentTransactionId })
    }),
  updateRecurrentTransaction: privateProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
        amount: z.number().min(0),
        categoryId: z.number().min(1),
        type: z.enum(getValues(TransactionType)),
        description: z.string(),
        isRecurrent: z.boolean(),
        frequency: z.enum(getValues(TransactionFrequency)),
      })
    )
    .mutation(async ({ input }) => {
      const updatedRecurrentTransaction = await transactionsClient.updateRecurrentTransaction(input)
      return updatedRecurrentTransaction
    }),
})
