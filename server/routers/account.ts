import { z } from "zod"

import { accountsClient } from "@/modules/accounts"
import { NotFoundError } from "@/src/utils/errors/errors"

import { privateProcedure, router } from "../trpc"

export const accountRouter = router({
  findOneByUserId: privateProcedure.input(z.void()).query(async ({ ctx }) => {
    const account = await accountsClient.getUserAccount({ userId: ctx.user.id })
    if (!account) {
      throw new NotFoundError(`Account for User ${ctx.user.id} not found`)
    }
    return account
  }),
})
