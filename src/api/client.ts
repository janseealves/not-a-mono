// Padrão same-origin: /api é roteado para a VPS pelo proxy (vercel.json em
// produção, vite server.proxy em dev). Sobrescreva via VITE_API_BASE_URL para
// apontar direto a um backend (ex.: http://localhost:8000 em desenvolvimento).
const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  /** status HTTP, ou undefined quando a rede falhou (backend fora do ar) */
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  get isOffline(): boolean {
    return this.status === undefined
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError('backend unreachable')
  }
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status)
  }
  return res.json() as Promise<T>
}

export const get = <T>(path: string) => request<T>(path)

export const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

// Consome uma resposta em Server-Sent Events (ver shared/streaming.py no
// backend): cada frame é `data: {"content": "..."}\n\n`, terminando em
// `data: [DONE]\n\n`. Gera o texto de cada chunk conforme chega.
export async function* postStream(path: string, body: unknown): AsyncGenerator<string> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError('backend unreachable')
  }
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status)
  }
  if (!res.body) return

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let frameEnd: number
    while ((frameEnd = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, frameEnd).trim()
      buffer = buffer.slice(frameEnd + 2)
      if (!frame.startsWith('data:')) continue

      const data = frame.slice('data:'.length).trim()
      if (data === '[DONE]') return
      yield (JSON.parse(data) as { content: string }).content
    }
  }
}
