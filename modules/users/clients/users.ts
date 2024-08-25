import { myContainer } from "@/modules/container/inversify.config"
import {
  CreateUser,
  CreateUserInput,
  FindOneUserById,
  FindOneUserByIdInput,
  Login,
  LoginInput,
  UpdateUser,
  UpdateUserInput,
} from "../use-cases"
import { TYPES } from "@/modules/container/types"

const createUser = myContainer.get<CreateUser>(TYPES.CreateUser)
const login = myContainer.get<Login>(TYPES.Login)
const findOneUserById = myContainer.get<FindOneUserById>(TYPES.FindOneUserById)
const updateUser = myContainer.get<UpdateUser>(TYPES.UpdateUser)

export const usersClient = {
  createOne: (input: CreateUserInput) => createUser.execute(input),
  login: (input: LoginInput) => login.execute(input),
  findOneById: (input: FindOneUserByIdInput) => findOneUserById.execute(input),
  updateOne: (input: UpdateUserInput) => updateUser.execute(input),
}
