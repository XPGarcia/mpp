import { z } from "zod"
import { procedure, router } from "../trpc"
import { submitFeedback } from "@/src/feedback/actions/subtmit-feedback"

export const feedbackRouter = router({
  submitOne: procedure
    .input(
      z.object({
        userId: z.number().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, message } = input
      const feedback = await submitFeedback({ userId, message })
      return { id: feedback.id }
    }),
})
