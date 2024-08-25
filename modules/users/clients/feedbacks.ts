import { myContainer } from "@/modules/container/inversify.config"
import { SubmitFeedback, SubmitFeedbackInput } from "../use-cases"
import { TYPES } from "@/modules/container/types"

const submitFeedback = myContainer.get<SubmitFeedback>(TYPES.SubmitFeedback)

export const feedbacksClient = {
  submitOne: (input: SubmitFeedbackInput) => submitFeedback.execute(input),
}
