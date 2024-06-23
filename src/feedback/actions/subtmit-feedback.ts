import { FeedbackRepository } from "../repositories/feedback-repository"

interface SubmitFeedbackInput {
  userId: number
  message: string
}

export const submitFeedback = async (input: SubmitFeedbackInput) => {
  return await FeedbackRepository.createOne(input)
}
