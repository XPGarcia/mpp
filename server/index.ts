import { categoryRouter } from "./routers/category"
import { feedbackRouter } from "./routers/feedback"
import { transactionRouter } from "./routers/transaction"
import { userRouter } from "./routers/user"
import { procedure, router, createCallerFactory } from "./trpc"

export const appRouter = router({
  healthCheck: procedure.query(() => "I'm ok!"),
  users: userRouter,
  transactions: transactionRouter,
  categories: categoryRouter,
  feedbacks: feedbackRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
