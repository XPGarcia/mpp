import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { User, UserRepository } from "@/modules/users/domain"

export type FindOneUserByIdInput = {
  userId: number
}

export type FindOneUserByIdOutput = Promise<User | undefined>

export interface FindOneUserByIdUseCase {
  execute(input: FindOneUserByIdInput): FindOneUserByIdOutput
}

@injectable()
export class FindOneUserById implements FindOneUserByIdUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository

  async execute(input: FindOneUserByIdInput): FindOneUserByIdOutput {
    return await this._userRepository.findById(input.userId)
  }
}
