import { httpBatchLink } from "@trpc/client"

import { createCaller } from "@/server"
import { getBaseUrl } from "./helpers"
import superjson from "superjson"

export const trpcServerClient = createCaller({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
})
