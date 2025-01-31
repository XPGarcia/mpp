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
  SendVerificationEmail,
  VerifyOTP,
} from "../use-cases"
import { TYPES } from "@/modules/container/types"

export const usersClient = {
  createOne: (input: CreateUserInput) => {
    const createUser = myContainer.get<CreateUser>(TYPES.CreateUser)
    return createUser.execute(input)
  },
  login: (input: LoginInput) => {
    const login = myContainer.get<Login>(TYPES.Login)
    return login.execute(input)
  },
  findOneById: (input: FindOneUserByIdInput) => {
    const findOneUserById = myContainer.get<FindOneUserById>(TYPES.FindOneUserById)
    return findOneUserById.execute(input)
  },
  updateOne: (input: UpdateUserInput) => {
    const updateUser = myContainer.get<UpdateUser>(TYPES.UpdateUser)
    return updateUser.execute(input)
  },
  sendVerificationEmail: (input: { userId: number }) => {
    const sendVerificationEmail = myContainer.get<SendVerificationEmail>(TYPES.SendVerificationEmail)
    return sendVerificationEmail.execute(input)
  },
  verifyOTP: (input: { userId: number; code: string }) => {
    const verifyOTP = myContainer.get<VerifyOTP>(TYPES.VerifyOTP)
    return verifyOTP.execute(input)
  },
}
