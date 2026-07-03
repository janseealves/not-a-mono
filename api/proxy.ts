// Proxy same-origin → backend na VPS.
//
// O endereço vem de VPS_ORIGIN (env var do Vercel, server-side), nunca do
// código: o IP fica fora do repositório e fora do bundle do cliente. O browser
// só fala com /api (HTTPS, mesma origem); o rewrite em vercel.json manda
// /api/* para cá com o caminho original em ?path=.

interface ProxyRequest {
  method?: string
  body?: unknown
  query?: Record<string, string | string[] | undefined>
}

interface ProxyResponse {
  writeHead(status: number, headers: Record<string, string>): void
  write(chunk: Uint8Array): void
  end(chunk?: string): void
}

export default async function handler(req: ProxyRequest, res: ProxyResponse) {
  const origin = process.env.VPS_ORIGIN
  if (!origin) {
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'VPS_ORIGIN não configurado' }))
    return
  }

  const raw = req.query?.path
  const path = Array.isArray(raw) ? raw.join('/') : (raw ?? '')
  const method = (req.method ?? 'GET').toUpperCase()
  const hasBody = method !== 'GET' && method !== 'HEAD' && req.body !== undefined

  try {
    const upstream = await fetch(`${origin}/${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    })
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    })

    // Repassa em stream (não buffereia) — necessário pro SSE de /ask chegar
    // token a token em vez de tudo de uma vez quando a resposta terminar.
    const reader = upstream.body?.getReader()
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch {
    res.writeHead(502, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'backend unreachable' }))
  }
}
