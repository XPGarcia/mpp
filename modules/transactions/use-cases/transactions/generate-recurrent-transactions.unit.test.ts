import dayjs from "dayjs"
import MockDate from "mockdate"

import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository, TransactionFrequency } from "@/modules/transactions/domain"

import { generateRecurrentTransactionMock } from "../../test"
import { generateTransactionMock } from "../../test/fixtures/transaction-mock"
import { CreateTransactionFromRecurrent } from "./create-transaction-from-recurrent"
import { GenerateRecurrentTransactions } from "./generate-recurrent-transactions"

const findAllRecurrentForPeriod = jest.fn() as jest.MockedFunction<
  RecurrentTransactionRepository["findAllRecurrentForPeriod"]
>

const execCreateTransactionFromRecurrent = jest.fn() as jest.MockedFunction<CreateTransactionFromRecurrent["execute"]>

const recurrentTransactionRepo = {
  findAllRecurrentForPeriod,
} as jest.Mocked<RecurrentTransactionRepository>

const createTransactionFromRecurrent = {
  execute: execCreateTransactionFromRecurrent,
} as jest.Mocked<CreateTransactionFromRecurrent>

const arrange = (): GenerateRecurrentTransactions => {
  myContainer
    .rebind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
    .toConstantValue(recurrentTransactionRepo)
  myContainer
    .rebind<CreateTransactionFromRecurrent>(TYPES.CreateTransactionFromRecurrent)
    .toConstantValue(createTransactionFromRecurrent)
  return myContainer.get<GenerateRecurrentTransactions>(TYPES.GenerateRecurrentTransactions)
}

describe("Generate recurrent transactions", () => {
  const useCase = arrange()
  const mockTransaction = generateTransactionMock()

  beforeEach(() => {
    execCreateTransactionFromRecurrent.mockResolvedValue(mockTransaction)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("Daily transactions", () => {
    const mockRecurrentTransaction = generateRecurrentTransactionMock({
      startDate: dayjs("2025-01-29T00:00:00Z").toDate(),
    })

    beforeEach(() => {
      MockDate.set("2025-01-29T00:00:00Z")
    })

    afterEach(() => {
      MockDate.reset()
      jest.restoreAllMocks()
    })

    it("should generate daily transactions", async () => {
      findAllRecurrentForPeriod.mockResolvedValueOnce([mockRecurrentTransaction])

      const result = await useCase.execute()

      expect(findAllRecurrentForPeriod).toHaveBeenCalledTimes(1)
      expect(findAllRecurrentForPeriod).toHaveBeenCalledWith("day")
      expect(execCreateTransactionFromRecurrent).toHaveBeenCalledWith(mockRecurrentTransaction)
      expect(result).toEqual([mockTransaction])
    })
  })

  describe("Weekly transactions", () => {
    const mockRecurrentTransaction = generateRecurrentTransactionMock({
      frequency: TransactionFrequency.WEEKLY,
      startDate: dayjs("2025-01-29T00:00:00Z").toDate(),
    })

    beforeEach(() => {
      MockDate.set("2025-01-26T00:00:00Z") // start of week (2025-01-26 to 2025-02-01)
      jest.clearAllMocks()
    })

    afterEach(() => {
      MockDate.reset()
      jest.restoreAllMocks()
    })

    it("should generate weekly transactions on start of week", async () => {
      findAllRecurrentForPeriod.mockResolvedValueOnce([]).mockResolvedValueOnce([mockRecurrentTransaction])

      const result = await useCase.execute()

      expect(findAllRecurrentForPeriod).toHaveBeenCalledTimes(2)
      expect(findAllRecurrentForPeriod).toHaveBeenCalledWith("day")
      expect(findAllRecurrentForPeriod).toHaveBeenCalledWith("week")
      expect(findAllRecurrentForPeriod).not.toHaveBeenCalledWith("month")
      expect(result).toEqual([mockTransaction])
    })
  })

  describe("Monthly transactions", () => {
    const mockRecurrentTransaction = generateRecurrentTransactionMock({
      frequency: TransactionFrequency.MONTHLY,
      startDate: dayjs("2025-02-15T00:00:00Z").toDate(),
    })

    beforeEach(() => {
      jest.clearAllMocks()
      MockDate.set("2025-02-01T00:00:00Z") // start of week (2025-02-01 to 2025-02-28)
    })

    afterEach(() => {
      MockDate.reset()
      jest.restoreAllMocks()
    })

    it("should generate monthly transactions on start of month", async () => {
      findAllRecurrentForPeriod.mockResolvedValueOnce([]).mockResolvedValueOnce([mockRecurrentTransaction])

      const result = await useCase.execute()

      expect(findAllRecurrentForPeriod).toHaveBeenCalledTimes(2)
      expect(findAllRecurrentForPeriod).toHaveBeenCalledWith("day")
      expect(findAllRecurrentForPeriod).not.toHaveBeenCalledWith("week")
      expect(findAllRecurrentForPeriod).toHaveBeenCalledWith("month")
      expect(result).toEqual([mockTransaction])
    })
  })
})
