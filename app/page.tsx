import { redirect } from "next/navigation"

import { AppRoutes } from "@/src/utils/routes"

export default function Home() {
  redirect(AppRoutes.dashboard)
}
