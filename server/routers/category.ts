import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { createCategoryForUser } from "@/src/categories/actions/create-category-for-user"
import { CategoryRepository } from "@/src/categories/repositories/category-repository"

export const categoryRouter = router({
  createOneForUser: privateProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        transactionTypeId: z.number().min(1),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, transactionTypeId, name } = input
      const category = await createCategoryForUser({ userId, transactionTypeId, name })
      return category
    }),
  findManyByUser: privateProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        transactionTypeId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId, transactionTypeId } = input
      const categories = await CategoryRepository.getUserCategoriesByTransaction({
        userId,
        transactionTypeId,
      })
      return categories
    }),
})
