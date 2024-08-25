import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { SpendingType, TransactionType } from "@/src/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { categoriesClient } from "@/modules/transactions"

export const categoryRouter = router({
  createOneForUser: privateProcedure
    .input(
      z.object({
        transactionType: z.enum(getValues(TransactionType)),
        name: z.string().min(1),
        spendingType: z.enum(getValues(SpendingType)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { transactionType, name, spendingType } = input
      const category = await categoriesClient.createCategoryForUser({
        userId: ctx.user.id,
        transactionType,
        name,
        spendingType,
      })
      return category
    }),
  findManyByUser: privateProcedure
    .input(
      z.object({
        transactionType: z.enum(getValues(TransactionType)),
      })
    )
    .query(async ({ input, ctx }) => {
      const categories = await categoriesClient.getUserCategoriesByTransaction({
        userId: ctx.user.id,
        transactionType: input.transactionType,
      })
      return categories
    }),
  updateOne: privateProcedure
    .input(
      z.object({
        categoryId: z.number().positive(),
        transactionType: z.enum(getValues(TransactionType)),
        spendingType: z.enum(getValues(SpendingType)),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const category = await categoriesClient.updateOne(input)
      return category
    }),
  deleteOne: privateProcedure
    .input(
      z.object({
        categoryId: z.number().positive(),
      })
    )
    .mutation(async ({ input }) => {
      await categoriesClient.deleteOne({ categoryId: input.categoryId })
    }),
  findManyBySpendTypeWithTotalSpend: privateProcedure
    .input(
      z.object({
        spendingType: z.enum(getValues(SpendingType)),
        date: z.object({ month: z.string(), year: z.string() }).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await categoriesClient.getUserCategoriesBySpendingType({
        userId: ctx.user.id,
        spendingType: input.spendingType,
        date: input.date,
      })
    }),
})
