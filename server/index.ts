import { accountRouter } from "./routers/account"
import { budgetRouter } from "./routers/budget"
import { categoryRouter } from "./routers/category"
import { feedbackRouter } from "./routers/feedback"
import { transactionRouter } from "./routers/transaction"
import { userRouter } from "./routers/user"
import { createCallerFactory,publicProcedure, router } from "./trpc"

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "I'm ok!"),
  users: userRouter,
  transactions: transactionRouter,
  categories: categoryRouter,
  feedbacks: feedbackRouter,
  budgets: budgetRouter,
  accounts: accountRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
