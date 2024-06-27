import { z } from "zod"
import { publicProcedure, privateProcedure, router } from "../trpc"
import { createUser } from "@/src/users/actions/create-user"
import { onboardUser } from "@/src/users/actions/onboard-user"

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { firstName, lastName, email, password } = input
      await createUser({ firstName, lastName, email, password })
      return { firstName, lastName, email }
    }),
  onboardUser: privateProcedure.input(z.object({})).mutation(async ({ input, ctx }) => {
    const userId = ctx.user.id
    await onboardUser({ userId })
  }),
})
