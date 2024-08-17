import { TYPES } from "@/modules/container/types"
import { Feedback, FeedbackRepository } from "@/modules/users/domain"
import { inject, injectable } from "inversify"

export type SubmitFeedbackInput = {
  userId: number
  message: string
}

export type SubmitFeedbackOutput = Promise<Feedback>

export interface SubmitFeedbackUseCase {
  execute(input: SubmitFeedbackInput): SubmitFeedbackOutput
}

@injectable()
export class SubmitFeedback implements SubmitFeedbackUseCase {
  @inject(TYPES.FeedbackRepository) private readonly _feedbackRepository!: FeedbackRepository
  async execute(input: SubmitFeedbackInput): SubmitFeedbackOutput {
    return await this._feedbackRepository.createOne(input)
  }
}
