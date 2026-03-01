import MockDate from "mockdate"

import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  RecurrentTransactionRepository,
  TransactionFrequency,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"

import { generateRecurrentTransactionMock } from "../../test"
import { generateTransactionMock } from "../../test/fixtures/transaction-mock"
import { CreateTransaction } from "./create-transaction"

const createOneTransaction = jest.fn() as jest.MockedFunction<TransactionRepository["createOne"]>
const createOneRecurrent = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["createOne"]>
const getAccountBalanceEntryByDate = jest.fn() as jest.MockedFunction<
  AccountsBalanceEntriesService["getAccountBalanceEntryByDate"]
>
const updateBalance = jest.fn() as jest.MockedFunction<AccountsService["updateBalance"]>

const transactionRepo = { createOne: createOneTransaction } as unknown as jest.Mocked<TransactionRepository>
const recurrentTransactionRepo = {
  createOne: createOneRecurrent,
} as unknown as jest.Mocked<RecurrentTransactionRepository>
const accountBalanceEntriesService = {
  getAccountBalanceEntryByDate,
} as unknown as jest.Mocked<AccountsBalanceEntriesService>
const accountsService = { updateBalance } as unknown as jest.Mocked<AccountsService>

const mockBalanceEntry = {
  id: 1,
  accountId: 10,
  amount: 0,
  description: "test",
  dateFrom: new Date(),
  dateTo: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const arrange = (): CreateTransaction => {
  myContainer.rebind<TransactionRepository>(TYPES.TransactionRepository).toConstantValue(transactionRepo)
  myContainer
    .rebind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
    .toConstantValue(recurrentTransactionRepo)
  myContainer
    .rebind<AccountsBalanceEntriesService>(TYPES.AccountBalanceEntriesService)
    .toConstantValue(accountBalanceEntriesService)
  myContainer.rebind<AccountsService>(TYPES.AccountsService).toConstantValue(accountsService)
  return myContainer.get<CreateTransaction>(TYPES.CreateTransaction)
}

describe.skip("CreateTransaction", () => {
  const useCase = arrange()

  beforeEach(() => {
    getAccountBalanceEntryByDate.mockResolvedValue(mockBalanceEntry)
    updateBalance.mockResolvedValue(undefined)
  })

  afterEach(() => {
    createOneTransaction.mockReset()
    createOneRecurrent.mockReset()
    getAccountBalanceEntryByDate.mockReset()
    updateBalance.mockReset()
    MockDate.reset()
  })

  describe("Non-recurrent transaction", () => {
    it("should create a simple transaction without recurrence", async () => {
      const mockTransaction = generateTransactionMock({ type: TransactionType.EXPENSE })
      createOneTransaction.mockResolvedValue(mockTransaction)

      const result = await useCase.execute({
        userId: 1,
        date: new Date(),
        amount: 100,
        categoryId: 1,
        type: TransactionType.EXPENSE,
        description: "Groceries",
        isRecurrent: false,
      })

      expect(result).toEqual(mockTransaction)
      expect(createOneRecurrent).not.toHaveBeenCalled()
    })
  })

  describe("Finite recurrent, start date = today", () => {
    it("should create recurrent with currentOccurrence=1 and description='desc (1/n)'", async () => {
      MockDate.set("2025-03-15T00:00:00Z")
      const mockTransaction = generateTransactionMock({ description: "Loan (1/6)" })
      const mockRecurrent = generateRecurrentTransactionMock({
        id: 99,
        totalOccurrences: 6,
        currentOccurrence: 1,
      })

      createOneRecurrent.mockResolvedValue(mockRecurrent)
      createOneTransaction.mockResolvedValue(mockTransaction)

      await useCase.execute({
        userId: 1,
        date: new Date("2025-03-15"),
        amount: 500,
        categoryId: 1,
        type: TransactionType.EXPENSE,
        description: "Loan",
        isRecurrent: true,
        frequency: TransactionFrequency.MONTHLY,
        totalOccurrences: 6,
      })

      expect(createOneRecurrent).toHaveBeenCalledWith(
        expect.objectContaining({
          totalOccurrences: 6,
          currentOccurrence: 1,
          finishedAt: undefined,
        })
      )
      expect(createOneTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Loan (1/6)",
        })
      )
    })
  })

  describe("Finite recurrent with totalOccurrences = 1", () => {
    it("should set finishedAt immediately", async () => {
      MockDate.set("2025-03-15T00:00:00Z")
      const mockTransaction = generateTransactionMock({ description: "(1/1)" })
      const mockRecurrent = generateRecurrentTransactionMock({
        id: 99,
        totalOccurrences: 1,
        currentOccurrence: 1,
        finishedAt: new Date(),
      })

      createOneRecurrent.mockResolvedValue(mockRecurrent)
      createOneTransaction.mockResolvedValue(mockTransaction)

      await useCase.execute({
        userId: 1,
        date: new Date("2025-03-15"),
        amount: 500,
        categoryId: 1,
        type: TransactionType.EXPENSE,
        isRecurrent: true,
        frequency: TransactionFrequency.MONTHLY,
        totalOccurrences: 1,
      })

      expect(createOneRecurrent).toHaveBeenCalledWith(
        expect.objectContaining({
          totalOccurrences: 1,
          currentOccurrence: 1,
          finishedAt: expect.any(Date),
        })
      )
    })
  })

  describe("Infinite recurrent transaction", () => {
    it("should create recurrent without occurrence tracking", async () => {
      MockDate.set("2025-03-15T00:00:00Z")
      const mockTransaction = generateTransactionMock({ description: "Rent" })
      const mockRecurrent = generateRecurrentTransactionMock({ id: 99 })

      createOneRecurrent.mockResolvedValue(mockRecurrent)
      createOneTransaction.mockResolvedValue(mockTransaction)

      await useCase.execute({
        userId: 1,
        date: new Date("2025-03-15"),
        amount: 1000,
        categoryId: 1,
        type: TransactionType.EXPENSE,
        description: "Rent",
        isRecurrent: true,
        frequency: TransactionFrequency.MONTHLY,
      })

      expect(createOneRecurrent).toHaveBeenCalledWith(
        expect.objectContaining({
          totalOccurrences: undefined,
          currentOccurrence: undefined,
          finishedAt: undefined,
        })
      )
      expect(createOneTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Rent",
        })
      )
    })
  })
})
