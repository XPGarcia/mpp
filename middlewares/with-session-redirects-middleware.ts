import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

import { CustomMiddleware } from "./chain-middlewares"
import { AppRoutes } from "@/src/utils/routes"
import { getSession } from "next-auth/react"

const witheListedPaths = ["/login", "/sign-up"]

export function withSessionRedirectsMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const pathname = request.nextUrl.pathname

    if (witheListedPaths.some((path) => pathname.startsWith(path))) {
      return middleware(request, event, response)
    }

    const session = await getSession({
      req: {
        ...request,
        headers: {
          ...Object.fromEntries(request.headers),
        },
      },
    })

    if (!session || !session.user || !session.user.verifiedAt) {
      const signInUrl = new URL(AppRoutes.login, request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    const user = session.user

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
