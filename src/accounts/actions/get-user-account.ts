import { AccountRepository } from "../repositories/account-repository"

interface GetUserAccountInput {
  userId: number
}

export const getUserAccount = async ({ userId }: GetUserAccountInput) => {
  const account = await AccountRepository.findByUserId(userId)
  return account
}
