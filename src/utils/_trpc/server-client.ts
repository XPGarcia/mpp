// import { httpBatchLink } from "@trpc/client"

// import { appRouter, createCaller } from "@/server"
// import { getBaseUrl } from "./helpers"
// import superjson from "superjson"
// import { createContext } from "@/server/context"
// import { createServerSideHelpers } from "@trpc/react-query/server"

// eslint-disable-next-line no-restricted-syntax
// export const trpcServerClient = createCaller(await createContext())

// links: [
//   httpBatchLink({
//     url: `${getBaseUrl()}/api/trpc`,
//     transformer: superjson,
//   }),
// ],

// export const trpcServerClient = createServerSideHelpers({
//   router: appRouter,
//   ctx: await createContext(),
//   transformer: superjson,
// })
