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
  DeleteTransaction,
  DeleteTransactionInput,
  UpdateTransactionInput,
  UpdateTransaction,
  FindTransactionInput,
  FindTransaction,
  FindTransactionsByUser,
  FindTransactionsByUserInput,
  FindTransactionsByUserAndMonth,
  FindTransactionsByUserAndMonthInput,
} from "@/modules/transactions/use-cases"
import {
  FindUserTransactions,
  FindUserTransactionsInput,
} from "../use-cases/transactions/find-transaction-by-categories"

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
  deleteOne: (input: DeleteTransactionInput) => {
    const deleteTransaction = myContainer.get<DeleteTransaction>(TYPES.DeleteTransaction)
    return deleteTransaction.execute(input)
  },
  updateOne: (input: UpdateTransactionInput) => {
    const updateTransaction = myContainer.get<UpdateTransaction>(TYPES.UpdateTransaction)
    return updateTransaction.execute(input)
  },
  findOne: (input: FindTransactionInput) => {
    const findTransaction = myContainer.get<FindTransaction>(TYPES.FindTransaction)
    return findTransaction.execute(input)
  },
  findManyByUser: (input: FindTransactionsByUserInput) => {
    const findTransactionsByUser = myContainer.get<FindTransactionsByUser>(TYPES.FindTransactionsByUser)
    return findTransactionsByUser.execute(input)
  },
  findManyByUserAndMonth: (input: FindTransactionsByUserAndMonthInput) => {
    const findTransactionsByUserAndMonth = myContainer.get<FindTransactionsByUserAndMonth>(
      TYPES.FindTransactionsByUserAndMonth
    )
    return findTransactionsByUserAndMonth.execute(input)
  },
  findUserTransactions: (input: FindUserTransactionsInput) => {
    const findUserTransactions = myContainer.get<FindUserTransactions>(TYPES.FindUserTransactions)
    return findUserTransactions.execute(input)
  },
}
