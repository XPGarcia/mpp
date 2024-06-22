import { AppRoutes } from "@/src/utils/routes"
import { redirect } from "next/navigation"

export default function Home() {
  redirect(AppRoutes.dashboard)
}
