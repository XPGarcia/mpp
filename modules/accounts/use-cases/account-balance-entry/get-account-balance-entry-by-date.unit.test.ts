import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { GetAccountBalanceEntryByDate } from "./get-account-balance-entry-by-date"
import { AccountBalanceEntryRepository, AccountRepository } from "@/modules/accounts/domain"
import { generateAccountBalanceEntryMock, generateAccountMock } from "@/modules/accounts/test"

const findByUserIdMock = jest.fn() as jest.MockedFunction<AccountRepository["findByUserId"]>
const findOneByAccountAndDateMock = jest.fn() as jest.MockedFunction<
  AccountBalanceEntryRepository["findOneByAccountAndDate"]
>
const createOneMock = jest.fn() as jest.MockedFunction<AccountBalanceEntryRepository["createOne"]>

const accountRepoMock = {
  findByUserId: findByUserIdMock,
} as jest.Mocked<AccountRepository>

const accountBalanceEntryRepoMock = {
  findOneByAccountAndDate: findOneByAccountAndDateMock,
  createOne: createOneMock,
} as jest.Mocked<AccountBalanceEntryRepository>

const arrange = (): GetAccountBalanceEntryByDate => {
  myContainer.rebind<AccountRepository>(TYPES.AccountRepository).toConstantValue(accountRepoMock)
  myContainer
    .rebind<AccountBalanceEntryRepository>(TYPES.AccountBalanceEntryRepository)
    .toConstantValue(accountBalanceEntryRepoMock)
  return myContainer.get<GetAccountBalanceEntryByDate>(TYPES.GetAccountBalanceEntryByDate)
}

describe("Get Account Balance Entry By Date", () => {
  const useCase = arrange()

  const accountMock = generateAccountMock()
  const accountBalanceEntryMock = generateAccountBalanceEntryMock({ accountId: accountMock.id })
  const newBalanceEntryMock = generateAccountBalanceEntryMock({ accountId: accountMock.id })

  beforeEach(() => {
    findByUserIdMock.mockResolvedValue(accountMock)
    findOneByAccountAndDateMock.mockResolvedValue(accountBalanceEntryMock)
    createOneMock.mockResolvedValue(newBalanceEntryMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should throw an error if account is not found", async () => {
    findByUserIdMock.mockResolvedValue(undefined)
    await expect(useCase.execute({ userId: 1, date: new Date() })).rejects.toThrow(`Account not found for user 1`)
  })

  it("should return balance entry if found", async () => {
    const date = new Date()
    const result = await useCase.execute({ userId: 1, date })
    expect(result).toStrictEqual(accountBalanceEntryMock)
    expect(findByUserIdMock).toHaveBeenCalledWith(1)
    expect(findOneByAccountAndDateMock).toHaveBeenCalledWith(accountMock.id, date)
    expect(createOneMock).not.toHaveBeenCalled()
  })

  it("should create a new balance entry for month with 31 days (January)", async () => {
    findOneByAccountAndDateMock.mockResolvedValue(undefined)
    const date = new Date("2024-01-15")
    const result = await useCase.execute({ userId: 1, date })
    expect(result).toStrictEqual(newBalanceEntryMock)
    expect(findByUserIdMock).toHaveBeenCalledWith(1)
    expect(findOneByAccountAndDateMock).toHaveBeenCalledWith(accountMock.id, date)
    expect(createOneMock).toHaveBeenCalledWith({
      accountId: accountMock.id,
      amount: 0,
      description: `Account Balance entry for 2024-01`,
      dateFrom: new Date("2024-01-01T00:00:00.000Z"),
      dateTo: new Date("2024-01-31T23:59:59.999Z"),
    })
  })

  it("should create a new balance entry for month with 30 days (April)", async () => {
    findOneByAccountAndDateMock.mockResolvedValue(undefined)
    const date = new Date("2024-04-15")
    await useCase.execute({ userId: 1, date })
    expect(createOneMock).toHaveBeenCalledWith({
      accountId: accountMock.id,
      amount: 0,
      description: `Account Balance entry for 2024-04`,
      dateFrom: new Date("2024-04-01T00:00:00.000Z"),
      dateTo: new Date("2024-04-30T23:59:59.999Z"),
    })
  })

  it("should create a new balance entry for (February)", async () => {
    findOneByAccountAndDateMock.mockResolvedValue(undefined)
    const date = new Date("2023-02-01")
    await useCase.execute({ userId: 1, date })
    expect(createOneMock).toHaveBeenCalledWith({
      accountId: accountMock.id,
      amount: 0,
      description: `Account Balance entry for 2023-02`,
      dateFrom: new Date("2023-02-01T00:00:00.000Z"),
      dateTo: new Date("2023-02-28T23:59:59.999Z"),
    })
  })

  it("should create a new balance entry for (February) in leap year", async () => {
    findOneByAccountAndDateMock.mockResolvedValue(undefined)
    const date = new Date("2024-02-01")
    await useCase.execute({ userId: 1, date })
    expect(createOneMock).toHaveBeenCalledWith({
      accountId: accountMock.id,
      amount: 0,
      description: `Account Balance entry for 2024-02`,
      dateFrom: new Date("2024-02-01T00:00:00.000Z"),
      dateTo: new Date("2024-02-29T23:59:59.999Z"),
    })
  })
})
