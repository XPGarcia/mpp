import { z } from "zod"

import { feedbacksClient } from "@/modules/users"

import { privateProcedure, router } from "../trpc"

export const feedbackRouter = router({
  submitOne: privateProcedure
    .input(
      z.object({
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const feedback = await feedbacksClient.submitOne({ userId: ctx.user.id, message: input.message })
      return { id: feedback.id }
    }),
})
