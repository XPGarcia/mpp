import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { createUser } from "@/src/auth/actions/create-user"

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
})
