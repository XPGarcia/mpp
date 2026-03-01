import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository } from "@/modules/transactions/domain"

import { FindUserRecurrentTransactions } from "./find-user-recurrent-transactions"

const findManyByUser = jest.fn() as jest.MockedFunction<RecurrentTransactionRepository["findManyByUser"]>

const recurrentTransactionRepo = {
  findManyByUser,
} as unknown as jest.Mocked<RecurrentTransactionRepository>

const arrange = (): FindUserRecurrentTransactions => {
  myContainer
    .rebind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
    .toConstantValue(recurrentTransactionRepo)
  return myContainer.get<FindUserRecurrentTransactions>(TYPES.FindUserRecurrentTransactions)
}

describe("FindUserRecurrentTransactions", () => {
  const useCase = arrange()

  afterEach(() => {
    findManyByUser.mockReset()
  })

  it("showDeleted: false — calls repo with { showDeleted: false }", async () => {
    findManyByUser.mockResolvedValue([])

    await useCase.execute({ userId: 1, showDeleted: false })

    expect(findManyByUser).toHaveBeenCalledWith(1, { showDeleted: false })
  })

  it("showDeleted: true — calls repo with { showDeleted: true }", async () => {
    findManyByUser.mockResolvedValue([])

    await useCase.execute({ userId: 1, showDeleted: true })

    expect(findManyByUser).toHaveBeenCalledWith(1, { showDeleted: true })
  })

  it("no showDeleted provided — defaults to true", async () => {
    findManyByUser.mockResolvedValue([])

    await useCase.execute({ userId: 1 })

    expect(findManyByUser).toHaveBeenCalledWith(1, { showDeleted: true })
  })
})
