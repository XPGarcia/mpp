import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateCategoryForUser,
  CreateCategoryForUserInput,
  CreateInitialCategoriesForUser,
  CreateInitialCategoriesForUserInput,
  DeleteOneCategory,
  DeleteOneCategoryInput,
  GetUserCategoriesBySpendingType,
  GetUserCategoriesBySpendingTypeInput,
  GetUserCategoriesByTransaction,
  GetUserCategoriesByTransactionInput,
  UpdateOneCategory,
  UpdateOneCategoryInput,
} from "@/modules/transactions/use-cases"

const createCategoryForUser = myContainer.get<CreateCategoryForUser>(TYPES.CreateCategoryForUser)
const createInitialCategoriesForUser = myContainer.get<CreateInitialCategoriesForUser>(
  TYPES.CreateInitialCategoriesForUser
)
const deleteOneCategory = myContainer.get<DeleteOneCategory>(TYPES.DeleteOneCategory)
const getUserCategoriesBySpendingType = myContainer.get<GetUserCategoriesBySpendingType>(
  TYPES.GetUserCategoriesBySpendingType
)
const updateOneCategory = myContainer.get<UpdateOneCategory>(TYPES.UpdateOneCategory)
const getUserCategoriesByTransaction = myContainer.get<GetUserCategoriesByTransaction>(
  TYPES.GetUserCategoriesByTransaction
)

export const categoriesClient = {
  createCategoryForUser: (input: CreateCategoryForUserInput) => createCategoryForUser.execute(input),
  createInitialCategoriesForUser: (input: CreateInitialCategoriesForUserInput) =>
    createInitialCategoriesForUser.execute(input),
  deleteOne: (input: DeleteOneCategoryInput) => deleteOneCategory.execute(input),
  getUserCategoriesBySpendingType: (input: GetUserCategoriesBySpendingTypeInput) =>
    getUserCategoriesBySpendingType.execute(input),
  updateOne: (input: UpdateOneCategoryInput) => updateOneCategory.execute(input),
  getUserCategoriesByTransaction: (input: GetUserCategoriesByTransactionInput) =>
    getUserCategoriesByTransaction.execute(input),
}
