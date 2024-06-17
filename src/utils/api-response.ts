import { NextResponse } from "next/server"
import { HttpError } from "./errors/errors"

export type ApiResponse<T> = {
  data: T
  status: number
  error?: string
}

type ApiResponseInput = {
  data?: any
  status?: number
}

type ApiResponseErrorInput = {
  error: unknown
}

export class ApiResponseBuilder<T> {
  static ok({ data = {}, status = 200 }: ApiResponseInput): NextResponse {
    return NextResponse.json(
      {
        data,
      },
      {
        status,
      }
    )
  }

  static created({ data = {}, status = 201 }: ApiResponseInput): NextResponse {
    return NextResponse.json(
      {
        data,
      },
      { status }
    )
  }

  static error({ error }: ApiResponseErrorInput): NextResponse {
    let name = "InternalServerError"
    let message = "Internal server error"
    if (error instanceof Error) {
      message = error.message
      name = error.name
    }
    let status = 500
    if (error instanceof HttpError) {
      status = error.status
    }

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
        statusText: name ?? "Internal Server error",
      }
    )
  }
}
