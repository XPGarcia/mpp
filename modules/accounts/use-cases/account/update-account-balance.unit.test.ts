import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import { UpdateAccountBalance } from "./update-account-balance"
import { generateAccountBalanceEntryMock, generateAccountMock } from "../../test/fixtures"
import { AccountBalanceEntryRepository, AccountRepository } from "@/modules/accounts/domain"

const findOneByIdMock = jest.fn() as jest.MockedFunction<AccountRepository["findOneById"]>
const updateBalanceMock = jest.fn() as jest.MockedFunction<AccountRepository["updateBalance"]>
const updateAmountMock = jest.fn() as jest.MockedFunction<AccountBalanceEntryRepository["updateAmount"]>

const accountRepoMock: AccountRepository = {
  findOneById: findOneByIdMock,
  updateBalance: updateBalanceMock,
} as jest.Mocked<AccountRepository>

const accountBalanceEntryRepoMock: AccountBalanceEntryRepository = {
  updateAmount: updateAmountMock,
} as jest.Mocked<AccountBalanceEntryRepository>

const arrange = (): UpdateAccountBalance => {
  myContainer.rebind<AccountRepository>(TYPES.AccountRepository).toConstantValue(accountRepoMock)
  myContainer
    .rebind<AccountBalanceEntryRepository>(TYPES.AccountBalanceEntryRepository)
    .toConstantValue(accountBalanceEntryRepoMock)
  return myContainer.get<UpdateAccountBalance>(TYPES.UpdateAccountBalance)
}

describe("Update Account Balance", () => {
  const useCase = arrange()

  const accountMock = generateAccountMock()
  const accountBalanceEntryMock = generateAccountBalanceEntryMock({ accountId: accountMock.id })

  beforeEach(() => {
    findOneByIdMock.mockResolvedValue(accountMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should throw an error if account is not found", async () => {
    findOneByIdMock.mockResolvedValue(undefined)
    await expect(useCase.execute({ accountBalanceEntry: accountBalanceEntryMock, amount: 100 })).rejects.toThrow(
      `Account with balance entry ID ${accountBalanceEntryMock.id} not found`
    )
  })

  it("should update account balance", async () => {
    const result = await useCase.execute({ accountBalanceEntry: accountBalanceEntryMock, amount: 100 })
    expect(result).toBeUndefined()
    expect(findOneByIdMock).toHaveBeenCalledWith(accountBalanceEntryMock.accountId)
    expect(updateBalanceMock).toHaveBeenCalledWith(accountBalanceEntryMock.accountId, accountMock.balance + 100)
    expect(updateAmountMock).toHaveBeenCalledWith(accountBalanceEntryMock.id, accountBalanceEntryMock.amount + 100)
  })
})
