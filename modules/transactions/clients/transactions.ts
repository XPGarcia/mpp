import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  GetMonthlyExpensesDistributionForUser,
  GetMonthlyExpensesDistributionInput,
} from "@/modules/transactions/use-cases"

const getMonthlyExpensesDistributionForUser = myContainer.get<GetMonthlyExpensesDistributionForUser>(
  TYPES.GetMonthlyExpensesDistributionForUser
)

export const transactionsClient = {
  getMonthlyExpensesDistributionForUser: (input: GetMonthlyExpensesDistributionInput) =>
    getMonthlyExpensesDistributionForUser.execute(input),
}
