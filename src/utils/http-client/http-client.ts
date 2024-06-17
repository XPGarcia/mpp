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
    const { data, error } = await response.json()
    if (response.ok) {
      return { data: data as T }
    }

    return { error: error as string }
  }

  static async get<T>(url: string): Promise<HttpClientResponse<T>> {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const { data, error } = await response.json()
    if (response.ok) {
      return { data: data as T }
    }

    return { error: error as string }
  }
}
