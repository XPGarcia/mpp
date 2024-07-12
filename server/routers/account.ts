import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { getUserAccount } from "@/src/accounts/actions/get-user-account"
import { NotFoundError } from "@/src/utils/errors/errors"

export const accountRouter = router({
  findOneByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const account = await getUserAccount({ userId: ctx.user.id })
    if (!account) {
      throw new NotFoundError(`Account for User ${ctx.user.id} not found`)
    }
    return account
  }),
})
