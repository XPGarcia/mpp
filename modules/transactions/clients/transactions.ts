import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  GetMonthlyExpensesDistributionForUser,
  GetMonthlyExpensesDistributionInput,
} from "@/modules/transactions/use-cases"

export const transactionsClient = {
  getMonthlyExpensesDistributionForUser: (input: GetMonthlyExpensesDistributionInput) => {
    const getMonthlyExpensesDistributionForUser = myContainer.get<GetMonthlyExpensesDistributionForUser>(
      TYPES.GetMonthlyExpensesDistributionForUser
    )
    return getMonthlyExpensesDistributionForUser.execute(input)
  },
}
