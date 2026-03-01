import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository } from "@/modules/transactions/domain"

import { generateRecurrentTransactionMock } from "../../test"
import { generateTransactionMock } from "../../test/fixtures/transaction-mock"
import { CreateTransaction } from "./create-transaction"
import { CreateTransactionFromRecurrent } from "./create-transaction-from-recurrent"

const execCreateTransaction = jest.fn() as jest.MockedFunction<CreateTransaction["execute"]>
const updateRecurrent = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["updateRecurrent"]>

const createTransaction = {
  execute: execCreateTransaction,
} as unknown as jest.Mocked<CreateTransaction>

const recurrentTransactionRepo = {
  updateRecurrent,
} as unknown as jest.Mocked<RecurrentTransactionRepository>

const arrange = (): CreateTransactionFromRecurrent => {
  myContainer.rebind(TYPES.CreateTransactionFromRecurrent).to(CreateTransactionFromRecurrent)
  myContainer.rebind<CreateTransaction>(TYPES.CreateTransaction).toConstantValue(createTransaction)
  myContainer
    .rebind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
    .toConstantValue(recurrentTransactionRepo)
  return myContainer.get<CreateTransactionFromRecurrent>(TYPES.CreateTransactionFromRecurrent)
}

describe("CreateTransactionFromRecurrent", () => {
  const useCase = arrange()
  const mockTransaction = generateTransactionMock()

  beforeEach(() => {
    execCreateTransaction.mockResolvedValue(mockTransaction)
    updateRecurrent.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Infinite recurrence", () => {
    it("should create transaction with original description and no counter logic", async () => {
      const recurrent = generateRecurrentTransactionMock({
        description: "Netflix",
        totalOccurrences: undefined,
        currentOccurrence: undefined,
        finishedAt: undefined,
      })

      await useCase.execute(recurrent)

      expect(execCreateTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Netflix",
          isRecurrent: false,
        })
      )
      expect(updateRecurrent).toHaveBeenCalledWith(
        recurrent.id,
        expect.not.objectContaining({ currentOccurrence: expect.anything() })
      )
    })
  })

  describe("Finite recurrence", () => {
    it("should format description as 'desc (x/n)' and increment counter", async () => {
      const recurrent = generateRecurrentTransactionMock({
        description: "Loan",
        totalOccurrences: 6,
        currentOccurrence: 2,
        finishedAt: undefined,
      })

      await useCase.execute(recurrent)

      expect(execCreateTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Loan (3/6)",
        })
      )
      expect(updateRecurrent).toHaveBeenCalledWith(
        recurrent.id,
        expect.objectContaining({ currentOccurrence: 3 })
      )
    })

    it("should set finishedAt when reaching the limit", async () => {
      const recurrent = generateRecurrentTransactionMock({
        description: "Loan",
        totalOccurrences: 3,
        currentOccurrence: 2,
        finishedAt: undefined,
      })

      await useCase.execute(recurrent)

      expect(execCreateTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Loan (3/3)",
        })
      )
      expect(updateRecurrent).toHaveBeenCalledWith(
        recurrent.id,
        expect.objectContaining({
          currentOccurrence: 3,
          finishedAt: expect.any(Date),
        })
      )
    })

    it("should throw error when recurrence is already finished", async () => {
      const recurrent = generateRecurrentTransactionMock({
        totalOccurrences: 3,
        currentOccurrence: 3,
        finishedAt: new Date(),
      })

      await expect(useCase.execute(recurrent)).rejects.toThrow("Recurrent transaction has already finished")
      expect(execCreateTransaction).not.toHaveBeenCalled()
    })

    it("should throw error when currentOccurrence >= totalOccurrences", async () => {
      const recurrent = generateRecurrentTransactionMock({
        totalOccurrences: 3,
        currentOccurrence: 3,
        finishedAt: undefined,
      })

      await expect(useCase.execute(recurrent)).rejects.toThrow(
        "Recurrent transaction has reached the maximum number of occurrences"
      )
      expect(execCreateTransaction).not.toHaveBeenCalled()
    })

    it("should output '(x/n)' when description is undefined", async () => {
      const recurrent = generateRecurrentTransactionMock({
        description: undefined,
        totalOccurrences: 5,
        currentOccurrence: 1,
        finishedAt: undefined,
      })

      await useCase.execute(recurrent)

      expect(execCreateTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "(2/5)",
        })
      )
    })
  })
})
