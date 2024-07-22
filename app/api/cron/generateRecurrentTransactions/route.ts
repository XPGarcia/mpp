import { generateRecurrentTransactions } from "@/src/transactions/actions/generate-recurrent-transactions"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { getStatusError } from "@/src/utils/errors/get-status-status"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  const transactions = []
  try {
    const newTransactions = await generateRecurrentTransactions()
    transactions.push(...newTransactions)
  } catch (e) {
    return new Response(getErrorMessage(e), {
      status: getStatusError(e),
    })
  }

  return Response.json({ success: true, transactions })
}
