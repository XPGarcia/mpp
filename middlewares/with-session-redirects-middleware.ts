import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

import { CustomMiddleware } from "./chain-middlewares"
import { AppRoutes } from "@/src/utils/routes"
import { getSession } from "next-auth/react"

export const config = {
  runtime: "nodejs", // rather than "edge"
  unstable_allowDynamic: [
    "/*", // file causing the build error in next-auth/react getSession
  ],
}

export function withSessionRedirectsMiddleware(middleware: CustomMiddleware) {
  const witheListedPaths = ["/login", "/sign-up", "/verify-email"]

  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const pathname = request.nextUrl.pathname
    const session = await getSession({
      req: {
        ...request,
        headers: {
          ...Object.fromEntries(request.headers),
        },
      },
    })

    const isAuthenticationRoute = pathname.startsWith(AppRoutes.login) || pathname.startsWith(AppRoutes.register)
    if ((!session || !session.user) && !isAuthenticationRoute) {
      const loginUrl = new URL(AppRoutes.login, request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const user = session?.user

    if (user && isAuthenticationRoute) {
      const dashboardUrl = new URL(AppRoutes.dashboard, request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    const isVerifyEmailRoute = pathname.startsWith(AppRoutes.verifyEmail)
    if (user?.verifiedAt && isVerifyEmailRoute) {
      const dashboardUrl = new URL(AppRoutes.dashboard, request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    if (witheListedPaths.some((path) => pathname.startsWith(path))) {
      return middleware(request, event, response)
    }

    if (!user?.verifiedAt) {
      const verifyEmailUrl = new URL(AppRoutes.verifyEmail, request.url)
      verifyEmailUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(verifyEmailUrl)
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
