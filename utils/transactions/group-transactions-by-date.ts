import dayjs from "dayjs"

type Transaction = {
  date: Date
}

type Format = "YYYY-MM" | "YYYY-MM-DD"

export const groupTransactionsByDate = <T extends Transaction>(
  transactions: T[],
  format?: Format
): { [key: string]: T[] } => {
  const groupedTransactionsByDate: { [key: string]: T[] } = {}

  for (const transaction of transactions) {
    const formattedDate = dayjs(transaction.date).format(format ?? "YYYY-MM")
    if (!groupedTransactionsByDate[formattedDate]) {
      groupedTransactionsByDate[formattedDate] = []
    }
    groupedTransactionsByDate[formattedDate].push(transaction)
  }

  return groupedTransactionsByDate
}
