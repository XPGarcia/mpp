import { myContainer } from "@/modules/container/inversify.config"
import { SubmitFeedback, SubmitFeedbackInput } from "../use-cases"
import { TYPES } from "@/modules/container/types"

export const feedbacksClient = {
  submitOne: (input: SubmitFeedbackInput) => {
    const submitFeedback = myContainer.get<SubmitFeedback>(TYPES.SubmitFeedback)
    return submitFeedback.execute(input)
  },
}
