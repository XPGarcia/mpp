import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import { Context } from "./context"

const t = initTRPC.context<Context>().create({ transformer: superjson })

export const router = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory

export const privateProcedure = t.procedure.use(async function isAuthorized(opts) {
  const { ctx } = opts
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  })
})
