import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

import { CustomMiddleware } from "./chain-middlewares"
import { AppRoutes } from "@/src/utils/routes"
import { Session, User } from "next-auth"

export function withSessionRedirectsMiddleware(middleware: CustomMiddleware) {
  const witheListedPaths = ["/login", "/sign-up"]

  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const pathname = request.nextUrl.pathname

    if (witheListedPaths.some((path) => pathname.startsWith(path))) {
      return middleware(request, event, response)
    }

    /**
     * The token should be appended to the request object by the withAuthMiddleware
     * before any middleware is called.
     */
    // @ts-ignore
    const user = request.nextauth?.token as User | null

    if (!user || !user.verifiedAt) {
      const signInUrl = new URL(AppRoutes.login, request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    const dashboardUrl = new URL(AppRoutes.dashboard, request.url)

    // onboarding
    const isOnboardingRoute = pathname.startsWith(AppRoutes.onboarding)
    if (!isOnboardingRoute && !user.onboardedAt) {
      const onboardingUrl = new URL(AppRoutes.onboarding, request.url)
      return NextResponse.redirect(onboardingUrl)
    } else if (isOnboardingRoute && user.onboardedAt) {
      return NextResponse.redirect(dashboardUrl)
    }

    return middleware(request, event, response)
  }
}
