import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateCategoryForUser,
  CreateCategoryForUserInput,
  CreateInitialCategoriesForUser,
  CreateInitialCategoriesForUserInput,
  DeleteOneCategory,
  DeleteOneCategoryInput,
  GetUserCategoriesByTransaction,
  GetUserCategoriesByTransactionInput,
  UpdateOneCategory,
  UpdateOneCategoryInput,
  FindUserCategoriesWithSpend,
  FindUserCategoriesWithSpendInput,
} from "@/modules/transactions/use-cases"

export const categoriesClient = {
  createCategoryForUser: (input: CreateCategoryForUserInput) => {
    const createCategoryForUser = myContainer.get<CreateCategoryForUser>(TYPES.CreateCategoryForUser)
    return createCategoryForUser.execute(input)
  },
  createInitialCategoriesForUser: (input: CreateInitialCategoriesForUserInput) => {
    const createInitialCategoriesForUser = myContainer.get<CreateInitialCategoriesForUser>(
      TYPES.CreateInitialCategoriesForUser
    )
    return createInitialCategoriesForUser.execute(input)
  },
  deleteOne: (input: DeleteOneCategoryInput) => {
    const deleteOneCategory = myContainer.get<DeleteOneCategory>(TYPES.DeleteOneCategory)
    return deleteOneCategory.execute(input)
  },
  updateOne: (input: UpdateOneCategoryInput) => {
    const updateOneCategory = myContainer.get<UpdateOneCategory>(TYPES.UpdateOneCategory)
    return updateOneCategory.execute(input)
  },
  getUserCategoriesByTransaction: (input: GetUserCategoriesByTransactionInput) => {
    const getUserCategoriesByTransaction = myContainer.get<GetUserCategoriesByTransaction>(
      TYPES.GetUserCategoriesByTransaction
    )
    return getUserCategoriesByTransaction.execute(input)
  },
  findUserCategoriesWithSpend: (input: FindUserCategoriesWithSpendInput) => {
    const findUserCategoriesWithSpend = myContainer.get<FindUserCategoriesWithSpend>(TYPES.FindUserCategoriesWithSpend)
    return findUserCategoriesWithSpend.execute(input)
  },
}
