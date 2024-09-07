import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateTransaction,
  GetMonthlyExpensesDistributionForUser,
  GetMonthlyExpensesDistributionInput,
  CreateTransactionInput,
} from "@/modules/transactions/use-cases"

export const transactionsClient = {
  getMonthlyExpensesDistributionForUser: (input: GetMonthlyExpensesDistributionInput) => {
    const getMonthlyExpensesDistributionForUser = myContainer.get<GetMonthlyExpensesDistributionForUser>(
      TYPES.GetMonthlyExpensesDistributionForUser
    )
    return getMonthlyExpensesDistributionForUser.execute(input)
  },
  createOne: (input: CreateTransactionInput) => {
    const createTransaction = myContainer.get<CreateTransaction>(TYPES.CreateTransaction)
    return createTransaction.execute(input)
  },
}
