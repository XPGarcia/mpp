type HttpErrorOptions = { status: number }

export class HttpError extends Error {
  status = 500

  constructor(message: string, options?: HttpErrorOptions) {
    super(message)
    this.status = options?.status ?? this.status
    Error.captureStackTrace(this, this.constructor)
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(message, { status: 500 })
    this.name = "InternalServerError"
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, { status: 400 })
    this.name = "BadRequestError"
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, { status: 404 })
    this.name = "NotFoundError"
  }
}
