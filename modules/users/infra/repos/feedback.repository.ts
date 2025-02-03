import { injectable } from "inversify"

import { db } from "@/db"
import { feedbacks } from "@/db/schema"
import { CreateFeedbackInput, Feedback, FeedbackRepository } from "@/modules/users/domain"

@injectable()
export class DrizzleFeedbackRepository implements FeedbackRepository {
  async createOne(input: CreateFeedbackInput): Promise<Feedback> {
    const createdFeedbacks = await db.insert(feedbacks).values(input).returning()
    return createdFeedbacks[0]
  }
}
