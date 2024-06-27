import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"
import { CustomMiddleware } from "./chain-middlewares"
import { AppRoutes } from "@/src/utils/routes"

const protectedPaths = ["/dashboard"]

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const token = await getToken({ req: request })

    // @ts-ignore
    request.nextauth = request.nextauth || {}
    // @ts-ignore
    request.nextauth.token = token
    const pathname = request.nextUrl.pathname

    if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
      const signInUrl = new URL(AppRoutes.login, request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    return middleware(request, event, response)
  }
}
