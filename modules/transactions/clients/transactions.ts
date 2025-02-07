import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateTransaction,
  CreateTransactionFromRecurrent,
  CreateTransactionFromRecurrentInput,
  CreateTransactionInput,
  DeleteRecurrentTransaction,
  DeleteRecurrentTransactionInput,
  DeleteTransaction,
  DeleteTransactionInput,
  FindRecurrentTransaction,
  FindRecurrentTransactionInput,
  FindTransaction,
  FindTransactionInput,
  FindUserRecurrentTransactions,
  FindUserRecurrentTransactionsInput,
  FindUserTransactions,
  FindUserTransactionsInput,
  GenerateRecurrentTransactions,
  GetMonthlyExpensesDistributionForUser,
  GetMonthlyExpensesDistributionInput,
  UpdateRecurrentTransaction,
  UpdateRecurrentTransactionInput,
  UpdateTransaction,
  UpdateTransactionInput,
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
  findUserTransactions: (input: FindUserTransactionsInput) => {
    const findUserTransactions = myContainer.get<FindUserTransactions>(TYPES.FindUserTransactions)
    return findUserTransactions.execute(input)
  },
  findUserRecurrentTransactions: (input: FindUserRecurrentTransactionsInput) => {
    const findUserRecurrentTransactions = myContainer.get<FindUserRecurrentTransactions>(
      TYPES.FindUserRecurrentTransactions
    )
    return findUserRecurrentTransactions.execute(input)
  },
  findRecurrentTransaction: (input: FindRecurrentTransactionInput) => {
    const findRecurrentTransaction = myContainer.get<FindRecurrentTransaction>(TYPES.FindRecurrentTransaction)
    return findRecurrentTransaction.execute(input)
  },
  deleteRecurrentTransaction: (input: DeleteRecurrentTransactionInput) => {
    const deleteRecurrentTransaction = myContainer.get<DeleteRecurrentTransaction>(TYPES.DeleteRecurrentTransaction)
    return deleteRecurrentTransaction.execute(input)
  },
  updateRecurrentTransaction: (input: UpdateRecurrentTransactionInput) => {
    const updateRecurrentTransaction = myContainer.get<UpdateRecurrentTransaction>(TYPES.UpdateRecurrentTransaction)
    return updateRecurrentTransaction.execute(input)
  },
}
