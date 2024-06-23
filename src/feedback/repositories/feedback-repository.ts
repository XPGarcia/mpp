import { db } from "@/db"
import { feedbacks } from "@/db/schema"

type CreateFeedbackInput = typeof feedbacks.$inferInsert

export class FeedbackRepository {
  static async createOne(input: CreateFeedbackInput) {
    const createdFeedbacks = await db.insert(feedbacks).values(input).returning()
    return createdFeedbacks[0]
  }
}
