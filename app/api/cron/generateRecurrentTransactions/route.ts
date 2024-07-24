import { generateRecurrentTransactions } from "@/src/transactions/actions/generate-recurrent-transactions"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { getStatusError } from "@/src/utils/errors/get-status-status"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log("Cron job started: generateRecurrentTransactions")

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Unauthorized to execute this cronjob")
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  console.log("Generating recurrent transactions")
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
