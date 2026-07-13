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

export interface SseFrame {
  /** nome do evento SSE ('message' é o default do EventSource quando ausente) */
  event: string
  data: unknown
}

// Consome uma resposta em Server-Sent Events (ver shared/streaming.py no
// backend): cada frame é `[event: <nome>\n]data: <json>\n\n`, terminando em
// `data: [DONE]\n\n`. Gera cada frame já decodificado conforme chega.
export async function* sseFrames(path: string, body: unknown): AsyncGenerator<SseFrame> {
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
      const frame = buffer.slice(0, frameEnd)
      buffer = buffer.slice(frameEnd + 2)

      let event = 'message'
      let dataLine: string | undefined
      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice('event:'.length).trim()
        else if (line.startsWith('data:')) dataLine = line.slice('data:'.length).trim()
      }
      if (dataLine === undefined) continue
      if (dataLine === '[DONE]') return
      yield { event, data: JSON.parse(dataLine) }
    }
  }
}
