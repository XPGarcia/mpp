import { BadRequestError } from "@/src/utils/errors/errors"
import { UserRepository } from "../repositories/user-repository"

interface OnboardUserInput {
  userId: number
}

export const onboardUser = async (input: OnboardUserInput): Promise<void> => {
  const updatedUser = await UserRepository.update(input.userId, { onboardedAt: new Date() })
  if (!updatedUser) {
    throw new BadRequestError("User not found")
  }
}
