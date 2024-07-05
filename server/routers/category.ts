import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { createCategoryForUser } from "@/src/categories/actions/create-category-for-user"
import { CategoryRepository } from "@/src/categories/repositories/category-repository"
import { TransactionType } from "@/src/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { updateOneCategory } from "@/src/categories/actions/update-one-category"

export const categoryRouter = router({
  createOneForUser: privateProcedure
    .input(
      z.object({
        transactionType: z.enum(getValues(TransactionType)),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { transactionType, name } = input
      const category = await createCategoryForUser({ userId: ctx.user.id, transactionType, name })
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
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { categoryId, transactionType, name } = input
      const category = await updateOneCategory({ categoryId, transactionType, name })
      return category
    }),
})
