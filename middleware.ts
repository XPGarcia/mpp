import { chain } from "./middlewares/chain-middlewares"
import { withAuthMiddleware } from "./middlewares/with-auth-middleware"
import { withSessionRedirectsMiddleware } from "./middlewares/with-session-redirects-middleware"

export const config = {
  runtime: "nodejs", // rather than "edge"
  unstable_allowDynamic: ["**"], // solve this in the future (needed for next-auth/react getSession in withSessionRedirectsMiddleware)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default chain([withAuthMiddleware, withSessionRedirectsMiddleware])
