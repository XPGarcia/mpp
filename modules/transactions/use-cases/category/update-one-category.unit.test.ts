import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { UpdateOneCategory } from "./update-one-category"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  CategoryRepository,
  SpendingType,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"
import { generateCategoryFromMock, generateAccountBalanceEntryMock } from "@/modules/transactions/test"
import { generateTransactionMock } from "../../test/fixtures/transaction-mock"

const findCategoryByIdMock = jest.fn() as jest.MockedFunction<CategoryRepository["findOneById"]>
const updateCategoryMock = jest.fn() as jest.MockedFunction<CategoryRepository["updateOne"]>
const updateTransactionsByCategoryIdMock = jest.fn() as jest.MockedFunction<
  TransactionRepository["updateManyByCategoryId"]
>
const findTransactionsByCategoryIdMock = jest.fn() as jest.MockedFunction<TransactionRepository["findAllByCategoryId"]>
const updateBalanceMock = jest.fn() as jest.MockedFunction<AccountsService["updateBalance"]>
const findBalanceEntryByAccountAndDateMock = jest.fn() as jest.MockedFunction<
  AccountsBalanceEntriesService["findOneByAccountAndDate"]
>
const categoryRepo = {
  findOneById: findCategoryByIdMock,
  updateOne: updateCategoryMock,
} as jest.Mocked<CategoryRepository>

const transactionRepo = {
  updateManyByCategoryId: updateTransactionsByCategoryIdMock,
  findAllByCategoryId: findTransactionsByCategoryIdMock,
} as jest.Mocked<TransactionRepository>

const accountsService = {
  updateBalance: updateBalanceMock,
} as jest.Mocked<AccountsService>

const accountBalanceEntriesService = {
  findOneByAccountAndDate: findBalanceEntryByAccountAndDateMock,
} as jest.Mocked<AccountsBalanceEntriesService>

const arrange = (): UpdateOneCategory => {
  myContainer.rebind<CategoryRepository>(TYPES.CategoryRepository).toConstantValue(categoryRepo)
  myContainer.rebind<TransactionRepository>(TYPES.TransactionRepository).toConstantValue(transactionRepo)
  myContainer.rebind<AccountsService>(TYPES.AccountsService).toConstantValue(accountsService)
  myContainer
    .rebind<AccountsBalanceEntriesService>(TYPES.AccountBalanceEntriesService)
    .toConstantValue(accountBalanceEntriesService)
  return myContainer.get<UpdateOneCategory>(TYPES.UpdateOneCategory)
}

describe("Update One Category", () => {
  const useCase = arrange()

  const oldCategoryMock = generateCategoryFromMock()
  const updatedCategoryMock = generateCategoryFromMock({ id: oldCategoryMock.id })

  const transactionOne = generateTransactionMock({
    accountId: 1,
    type: oldCategoryMock.transactionType,
    date: new Date("2024-01-01"),
    amount: 100,
  })
  const transactionTwo = generateTransactionMock({
    accountId: 1,
    type: oldCategoryMock.transactionType,
    date: new Date("2024-01-25"),
    amount: 100,
  })
  const transactionThree = generateTransactionMock({
    accountId: 1,
    type: oldCategoryMock.transactionType,
    date: new Date("2024-02-01"),
    amount: 200,
  })
  const transactionFour = generateTransactionMock({
    accountId: 1,
    type: oldCategoryMock.transactionType,
    date: new Date("2024-02-25"),
    amount: 200,
  })

  const janBalanceEntry = generateAccountBalanceEntryMock()
  const febBalanceEntry = generateAccountBalanceEntryMock()

  beforeEach(() => {
    findCategoryByIdMock.mockResolvedValue(oldCategoryMock)
    updateCategoryMock.mockResolvedValue(updatedCategoryMock)
    findTransactionsByCategoryIdMock.mockResolvedValue([
      transactionOne,
      transactionTwo,
      transactionThree,
      transactionFour,
    ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should throw error if category not found", async () => {
    findCategoryByIdMock.mockResolvedValue(undefined)
    await expect(
      useCase.execute({
        categoryId: oldCategoryMock.id,
        name: "new name",
        transactionType: oldCategoryMock.transactionType,
        spendingType: oldCategoryMock.spendingType,
      })
    ).rejects.toThrow("Category not found")
  })

  it("should throw error if failed to update category", async () => {
    updateCategoryMock.mockResolvedValue(undefined)
    await expect(
      useCase.execute({
        categoryId: oldCategoryMock.id,
        name: "new name",
        transactionType: oldCategoryMock.transactionType,
        spendingType: oldCategoryMock.spendingType,
      })
    ).rejects.toThrow("Failed to update category")
  })

  it("should update category with same transaction type", async () => {
    const result = await useCase.execute({
      categoryId: oldCategoryMock.id,
      name: "new name",
      transactionType: oldCategoryMock.transactionType,
      spendingType: oldCategoryMock.spendingType,
    })

    expect(result).toStrictEqual(updatedCategoryMock)
    expect(updateCategoryMock).toHaveBeenCalledWith(oldCategoryMock.id, {
      name: "new name",
      transactionType: oldCategoryMock.transactionType,
      spendingType: oldCategoryMock.spendingType,
    })
    expect(findTransactionsByCategoryIdMock).not.toHaveBeenCalled()
    expect(updateTransactionsByCategoryIdMock).not.toHaveBeenCalled()
    expect(findBalanceEntryByAccountAndDateMock).not.toHaveBeenCalled()
    expect(updateBalanceMock).not.toHaveBeenCalled()
  })

  it("should update category with different transaction type", async () => {
    updateCategoryMock.mockResolvedValue({
      ...updatedCategoryMock,
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    })
    findTransactionsByCategoryIdMock.mockResolvedValue([])
    const result = await useCase.execute({
      categoryId: oldCategoryMock.id,
      name: "new name",
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    })

    expect(result).toStrictEqual({
      ...updatedCategoryMock,
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    })
    expect(updateCategoryMock).toHaveBeenCalledWith(oldCategoryMock.id, {
      name: "new name",
      transactionType: oldCategoryMock.transactionType,
      spendingType: oldCategoryMock.spendingType,
    })
    expect(findTransactionsByCategoryIdMock).toHaveBeenCalledWith(updatedCategoryMock.id)
    expect(updateTransactionsByCategoryIdMock).not.toHaveBeenCalled()
    expect(findBalanceEntryByAccountAndDateMock).not.toHaveBeenCalled()
    expect(updateBalanceMock).not.toHaveBeenCalled()
  })

  it("should update category with different transaction type from EXPENSE to INCOME along with transactions and balance", async () => {
    findBalanceEntryByAccountAndDateMock.mockResolvedValueOnce(janBalanceEntry)
    findBalanceEntryByAccountAndDateMock.mockResolvedValueOnce(febBalanceEntry)

    // arrange
    const updatedCategory = {
      ...updatedCategoryMock,
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    }
    updateCategoryMock.mockResolvedValue(updatedCategory)

    // execute
    const result = await useCase.execute({
      categoryId: oldCategoryMock.id,
      name: "new name",
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    })

    // assert
    expect(result).toStrictEqual(updatedCategory)
    expect(updateCategoryMock).toHaveBeenCalledWith(oldCategoryMock.id, {
      name: "new name",
      transactionType: oldCategoryMock.transactionType,
      spendingType: oldCategoryMock.spendingType,
    })
    expect(findTransactionsByCategoryIdMock).toHaveBeenCalledWith(updatedCategory.id)
    expect(updateTransactionsByCategoryIdMock).toHaveBeenCalledWith(updatedCategory.id, {
      type: updatedCategory.transactionType,
    })
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledTimes(2)
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledWith({
      accountId: 1,
      date: new Date("2024-01-15"),
    })
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledWith({
      accountId: 1,
      date: new Date("2024-02-15"),
    })
    expect(updateBalanceMock).toHaveBeenCalledTimes(2)
    expect(updateBalanceMock).toHaveBeenCalledWith({
      accountBalanceEntry: janBalanceEntry,
      amount: 400,
    })
    expect(updateBalanceMock).toHaveBeenCalledWith({
      accountBalanceEntry: febBalanceEntry,
      amount: 800,
    })

    findBalanceEntryByAccountAndDateMock.mockRestore()
    updateBalanceMock.mockRestore()
  })

  it("should update category with different transaction type from INCOME to EXPENSE along with transactions and balance", async () => {
    findBalanceEntryByAccountAndDateMock.mockResolvedValueOnce(janBalanceEntry)
    findBalanceEntryByAccountAndDateMock.mockResolvedValueOnce(febBalanceEntry)

    // arrange
    findCategoryByIdMock.mockResolvedValue({
      ...oldCategoryMock,
      transactionType: TransactionType.INCOME,
      spendingType: SpendingType.NO_APPLY,
    })
    updateCategoryMock.mockResolvedValue(updatedCategoryMock)

    // execute
    const result = await useCase.execute({
      categoryId: oldCategoryMock.id,
      name: "new name",
      transactionType: TransactionType.EXPENSE,
      spendingType: SpendingType.NECESSITY,
    })

    // assert
    expect(result).toStrictEqual(updatedCategoryMock)
    expect(updateCategoryMock).toHaveBeenCalledWith(oldCategoryMock.id, {
      name: "new name",
      transactionType: TransactionType.EXPENSE,
      spendingType: SpendingType.NECESSITY,
    })
    expect(findTransactionsByCategoryIdMock).toHaveBeenCalledWith(updatedCategoryMock.id)
    expect(updateTransactionsByCategoryIdMock).toHaveBeenCalledWith(updatedCategoryMock.id, {
      type: updatedCategoryMock.transactionType,
    })
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledTimes(2)
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledWith({
      accountId: 1,
      date: new Date("2024-01-15"),
    })
    expect(findBalanceEntryByAccountAndDateMock).toHaveBeenCalledWith({
      accountId: 1,
      date: new Date("2024-02-15"),
    })
    expect(updateBalanceMock).toHaveBeenCalledTimes(2)
    expect(updateBalanceMock).toHaveBeenCalledWith({
      accountBalanceEntry: janBalanceEntry,
      amount: -400,
    })
    expect(updateBalanceMock).toHaveBeenCalledWith({
      accountBalanceEntry: febBalanceEntry,
      amount: -800,
    })

    findBalanceEntryByAccountAndDateMock.mockRestore()
    updateBalanceMock.mockRestore()
  })
})
