import { z } from "zod"

import { categoriesClient } from "@/modules/transactions"
import { SpendingType, TransactionType } from "@/modules/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"

import { privateProcedure, router } from "../trpc"

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
  findUserCategoriesWithSpend: privateProcedure
    .input(
      z.object({
        spendingTypes: z.array(z.enum(getValues(SpendingType))).optional(),
        transactionTypes: z.array(z.enum(getValues(TransactionType))).optional(),
        date: z.object({ month: z.string(), year: z.string() }).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const categories = await categoriesClient.findUserCategoriesWithSpend({
        userId: ctx.user.id,
        filters: input,
      })
      return categories
    }),
})
