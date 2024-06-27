export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  verifiedAt: Date | null
  onboardedAt: Date | null
}
