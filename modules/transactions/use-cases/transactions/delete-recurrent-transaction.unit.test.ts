import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository } from "@/modules/transactions/domain"
import { NotFoundError } from "@/src/utils/errors/errors"

import { generateRecurrentTransactionMock } from "../../test"
import { DeleteRecurrentTransaction } from "./delete-recurrent-transaction"

const findOneById = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["findOneById"]>
const updateRecurrent = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["updateRecurrent"]>
const deleteOneById = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["deleteOneById"]>

const recurrentTransactionRepo = {
  findOneById,
  updateRecurrent,
  deleteOneById,
} as unknown as jest.Mocked<RecurrentTransactionRepository>

const arrange = (): DeleteRecurrentTransaction => {
  myContainer
    .rebind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
    .toConstantValue(recurrentTransactionRepo)
  return myContainer.get<DeleteRecurrentTransaction>(TYPES.DeleteRecurrentTransaction)
}

describe("DeleteRecurrentTransaction", () => {
  const useCase = arrange()

  afterEach(() => {
    findOneById.mockReset()
    updateRecurrent.mockReset()
    deleteOneById.mockReset()
  })

  it("should call updateRecurrent with deletedAt set to a Date", async () => {
    const mockRecurrent = generateRecurrentTransactionMock({ id: 1 })
    findOneById.mockResolvedValue(mockRecurrent)
    updateRecurrent.mockResolvedValue(mockRecurrent)

    await useCase.execute({ recurrentTransactionId: 1 })

    expect(updateRecurrent).toHaveBeenCalledWith(1, { deletedAt: expect.any(Date) })
  })

  it("should NOT call deleteOneById", async () => {
    const mockRecurrent = generateRecurrentTransactionMock({ id: 1 })
    findOneById.mockResolvedValue(mockRecurrent)
    updateRecurrent.mockResolvedValue(mockRecurrent)

    await useCase.execute({ recurrentTransactionId: 1 })

    expect(deleteOneById).not.toHaveBeenCalled()
  })

  it("should throw NotFoundError when recurrent transaction not found", async () => {
    findOneById.mockResolvedValue(undefined)

    await expect(useCase.execute({ recurrentTransactionId: 999 })).rejects.toThrow(NotFoundError)
  })
})
