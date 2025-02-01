import { Category, SpendingType, TransactionType, WithSpend } from "../entities"

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
  findUserCategoriesWithSpend({
    userId,
    filters,
  }: {
    userId: number
    filters: FindUserCategoriesFilters
  }): Promise<WithSpend<Category>[]>
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

export type FindUserCategoriesFilters = {
  date?: { month: string; year: string }
  spendingTypes?: SpendingType[]
  transactionTypes?: TransactionType[]
}
