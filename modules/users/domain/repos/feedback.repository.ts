import { Feedback } from "../entities"

export interface FeedbackRepository {
  createOne(input: CreateFeedbackInput): Promise<Feedback>
}

export type CreateFeedbackInput = {
  message: string
  userId: number
  id?: number
  createdAt?: Date
  updatedAt?: Date
}
