export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""
  }
  if (process.env.CURRENT_ENV === "local") {
    return "http://localhost:3000"
  }
  return `${process.env.BASE_URL}`
}
