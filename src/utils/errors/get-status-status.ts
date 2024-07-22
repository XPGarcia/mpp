import { HttpError } from "./errors"

export const getStatusError = (error: unknown): number => {
  if (error instanceof HttpError) {
    return error.status
  }
  return 500
}
