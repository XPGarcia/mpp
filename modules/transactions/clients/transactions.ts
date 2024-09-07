import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateTransaction,
  GetMonthlyExpensesDistributionForUser,
  GetMonthlyExpensesDistributionInput,
  CreateTransactionInput,
  CreateTransactionFromRecurrentInput,
  CreateTransactionFromRecurrent,
  GenerateRecurrentTransactions,
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
  createTransactionFromRecurrent: (input: CreateTransactionFromRecurrentInput) => {
    const createTransactionFromRecurrent = myContainer.get<CreateTransactionFromRecurrent>(
      TYPES.CreateTransactionFromRecurrent
    )
    return createTransactionFromRecurrent.execute(input)
  },
  generateRecurrentTransactions: () => {
    const generateRecurrentTransactions = myContainer.get<GenerateRecurrentTransactions>(
      TYPES.GenerateRecurrentTransactions
    )
    return generateRecurrentTransactions.execute()
  },
}
