import { Category, SpendingType, TransactionType } from "../entities"

export interface CategoryRepository {
  getUserCategoriesByTransaction({
    userId,
    transactionType,
  }: {
    userId: number
    transactionType: TransactionType
  }): Promise<Category[]>
  createForUser(values: CreateCategoryInput): Promise<Category | undefined>
  createManyForUser(values: CreateCategoryInput[]): Promise<Category[]>
  findOneById(categoryId: number): Promise<Category | undefined>
  updateOne(categoryId: number, values: UpdateCategoryInput): Promise<Category | undefined>
  deleteOne(categoryId: number): Promise<void>
  getUserCategoriesBySpendingTypeWithTotalSpend({
    userId,
    spendingType,
    date,
  }: {
    userId: number
    spendingType: SpendingType
    date?: { month: string; year: string }
  }): Promise<
    {
      id: number
      name: string
      spendingTypeId: number
      totalSpend: number
    }[]
  >
}

export type CreateCategoryInput = {
  name: string
  transactionType: TransactionType
  spendingType: SpendingType
  userId?: number | null
  id?: number
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateCategoryInput = Omit<Partial<CreateCategoryInput>, "userId" | "id">
