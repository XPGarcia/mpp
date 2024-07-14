import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { createCategoryForUser } from "@/src/categories/actions/create-category-for-user"
import { CategoryRepository } from "@/src/categories/repositories/category-repository"
import { SpendingType, TransactionType } from "@/src/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { updateOneCategory } from "@/src/categories/actions/update-one-category"
import { deleteOneCategory } from "@/src/categories/actions/delete-one-category"
import { getUserCategoriesBySpendingTypeWithTotalForUser } from "@/src/categories/actions/get-user-categories-by-spend-type-with-total-spend"

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
      const category = await createCategoryForUser({ userId: ctx.user.id, transactionType, name, spendingType })
      return category
    }),
  findManyByUser: privateProcedure
    .input(
      z.object({
        transactionType: z.enum(getValues(TransactionType)),
      })
    )
    .query(async ({ input, ctx }) => {
      const categories = await CategoryRepository.getUserCategoriesByTransaction({
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
      const category = await updateOneCategory(input)
      return category
    }),
  deleteOne: privateProcedure
    .input(
      z.object({
        categoryId: z.number().positive(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteOneCategory(input.categoryId)
    }),
  findManyBySpendTypeWithTotalSpend: privateProcedure
    .input(
      z.object({
        spendingType: z.enum(getValues(SpendingType)),
      })
    )
    .query(async ({ input, ctx }) => {
      return await getUserCategoriesBySpendingTypeWithTotalForUser({
        userId: ctx.user.id,
        spendingType: input.spendingType,
      })
    }),
})
