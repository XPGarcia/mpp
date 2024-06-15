import { NextResponse, NextRequest } from "next/server"
import { ApiResponseBuilder } from "../api-response"

export const apiMiddleware =
  (...handlers: Function[]) =>
  async (req: NextRequest, res: NextResponse) => {
    try {
      for (const handler of handlers) {
        const response = await handler(req, res)
        if (response) {
          return response
        } else {
          throw new Error("Handler did not return a response")
        }
      }
    } catch (error) {
      return ApiResponseBuilder.error({ error })
    }
  }
