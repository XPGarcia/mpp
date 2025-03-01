import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { UpdateUserInput as UpdateUserInputRepo,User, UserRepository } from "@/modules/users/domain"
import { InternalServerError } from "@/src/utils/errors/errors"

export type UpdateUserInput = {
  userId: number
  data: UpdateUserInputRepo
}

export type UpdateUserOutput = Promise<User>

export interface UpdateUserUseCase {
  execute(input: UpdateUserInput): UpdateUserOutput
}

@injectable()
export class UpdateUser implements UpdateUserUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository

  async execute(input: UpdateUserInput): UpdateUserOutput {
    const updatedUser = await this._userRepository.update(input.userId, input.data)
    if (!updatedUser) {
      throw new InternalServerError("Something went wrong while updating the user")
    }
    return updatedUser
  }
}
