export type HttpClientResponse<T> = {
  data?: T
  error?: string
}

export class HttpClient {
  static async post<T>(url: string, body: unknown): Promise<HttpClientResponse<T>> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (response.ok) {
      return { data: data as T }
    }

    return { error: data.error as string }
  }
}
