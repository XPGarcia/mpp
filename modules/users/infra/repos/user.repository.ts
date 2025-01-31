import { injectable } from "inversify"
import { CreateUserInput, User, UserRepository } from "@/modules/users/domain"
import { db } from "@/db"
import { otpCodes, users } from "@/db/schema"
import { and, eq, gt, isNull } from "drizzle-orm"
import { generate as generateOtp } from "otp-generator"
import dayjs from "dayjs"

@injectable()
export class DrizzleUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const createdUser = await db.insert(users).values(input).returning()
    return createdUser[0]
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  async findById(id: number): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }

  async update(id: number, input: Partial<User>): Promise<User | undefined> {
    const user = await this.findById(id)
    if (!user) {
      return
    }

    const updatedUser = await db.update(users).set(input).where(eq(users.id, id)).returning()
    return updatedUser[0]
  }

  async createOTP(userId: number): Promise<string> {
    const otp = generateOtp(6, { specialChars: false })

    await db
      .update(otpCodes)
      .set({ expiredAt: dayjs().toDate() })
      .where(and(eq(otpCodes.userId, userId), isNull(otpCodes.usedAt)))

    await db.insert(otpCodes).values({
      userId,
      code: otp,
    })

    return otp
  }

  async verifyOTP(userId: number, code: string): Promise<boolean> {
    const otp = await db.query.otpCodes.findFirst({
      where: and(
        eq(otpCodes.userId, userId),
        eq(otpCodes.code, code),
        isNull(otpCodes.expiredAt),
        isNull(otpCodes.usedAt),
        gt(otpCodes.createdAt, dayjs().subtract(10, "minute").toDate())
      ),
    })
    if (!otp) {
      return false
    }

    Promise.all([
      await db.update(otpCodes).set({ usedAt: dayjs().toDate() }).where(eq(otpCodes.id, otp.id)),
      await db.update(users).set({ verifiedAt: dayjs().toDate() }).where(eq(users.id, userId)),
    ])
    return true
  }
}
