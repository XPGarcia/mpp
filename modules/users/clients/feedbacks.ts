import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"

import { SubmitFeedback, SubmitFeedbackInput } from "../use-cases"

export const feedbacksClient = {
  submitOne: (input: SubmitFeedbackInput) => {
    const submitFeedback = myContainer.get<SubmitFeedback>(TYPES.SubmitFeedback)
    return submitFeedback.execute(input)
  },
}
