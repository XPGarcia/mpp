export { default } from "next-auth/middleware"
export const config = {
  matcher: ["/", "/options", "/transactions/add", "/transactions", "/stats", "/accounts"],
}
