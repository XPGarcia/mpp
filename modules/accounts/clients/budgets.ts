import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { CreateOneBudget, CreateOneBudgetInput, FindOneBudgetByUserId, FindOneBudgetByUserIdInput } from "../use-cases"

const createOneBudget = myContainer.get<CreateOneBudget>(TYPES.CreateOneBudget)
const findOneBudgetByUserId = myContainer.get<FindOneBudgetByUserId>(TYPES.FindOneBudgetByUserId)

export const budgetsClient = {
  createOne: (input: CreateOneBudgetInput) => createOneBudget.execute(input),
  findOneByUserId: (input: FindOneBudgetByUserIdInput) => findOneBudgetByUserId.execute(input),
}
