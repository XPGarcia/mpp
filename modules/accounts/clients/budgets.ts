import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"

import { CreateOneBudget, CreateOneBudgetInput, FindOneBudgetByUserId, FindOneBudgetByUserIdInput } from "../use-cases"

export const budgetsClient = {
  createOne: (input: CreateOneBudgetInput) => {
    const createOneBudget = myContainer.get<CreateOneBudget>(TYPES.CreateOneBudget)
    return createOneBudget.execute(input)
  },
  findOneByUserId: (input: FindOneBudgetByUserIdInput) => {
    const findOneBudgetByUserId = myContainer.get<FindOneBudgetByUserId>(TYPES.FindOneBudgetByUserId)
    return findOneBudgetByUserId.execute(input)
  },
}
