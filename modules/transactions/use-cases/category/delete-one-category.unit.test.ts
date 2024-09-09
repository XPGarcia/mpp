import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { DeleteOneCategory } from "./delete-one-category"
import { CategoryRepository, TransactionRepository } from "@/modules/transactions/domain"

const deleteCategoryMock = jest.fn() as jest.MockedFunction<CategoryRepository["deleteOne"]>
const countTransactionsByCategoryIdMock = jest.fn() as jest.MockedFunction<TransactionRepository["countByCategoryId"]>

const categoryRepo = {
  deleteOne: deleteCategoryMock,
} as jest.Mocked<CategoryRepository>

const transactionRepo = {
  countByCategoryId: countTransactionsByCategoryIdMock,
} as jest.Mocked<TransactionRepository>

const arrange = (): DeleteOneCategory => {
  myContainer.rebind<CategoryRepository>(TYPES.CategoryRepository).toConstantValue(categoryRepo)
  myContainer.rebind<TransactionRepository>(TYPES.TransactionRepository).toConstantValue(transactionRepo)
  return myContainer.get<DeleteOneCategory>(TYPES.DeleteOneCategory)
}

describe("Delete One Category", () => {
  const useCase = arrange()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should delete a category", async () => {
    countTransactionsByCategoryIdMock.mockResolvedValue(0)
    await useCase.execute({ categoryId: 1 })
    expect(deleteCategoryMock).toHaveBeenCalledWith(1)
  })

  it("should throw an error if category has transactions", async () => {
    countTransactionsByCategoryIdMock.mockResolvedValue(1)
    await expect(useCase.execute({ categoryId: 1 })).rejects.toThrow(
      "Category has transactions associated. Please delete the transactions before deleting the category"
    )
  })
})
