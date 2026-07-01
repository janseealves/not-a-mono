// Proxy same-origin → backend na VPS.
//
// O endereço vem de VPS_ORIGIN (env var do Vercel, server-side), nunca do
// código: o IP fica fora do repositório e fora do bundle do cliente. O browser
// só fala com /api (HTTPS, mesma origem) e esta função repassa para a VPS.

interface ProxyRequest {
  url?: string
  method?: string
  body?: unknown
}

interface ProxyResponse {
  writeHead(status: number, headers: Record<string, string>): void
  end(chunk?: string): void
}

export default async function handler(req: ProxyRequest, res: ProxyResponse) {
  const origin = process.env.VPS_ORIGIN
  if (!origin) {
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'VPS_ORIGIN não configurado' }))
    return
  }

  // /api/v1/rag/ask → /v1/rag/ask (preserva query string)
  const path = (req.url ?? '').replace(/^\/api/, '') || '/'
  const method = (req.method ?? 'GET').toUpperCase()
  const hasBody = method !== 'GET' && method !== 'HEAD' && req.body !== undefined

  try {
    const upstream = await fetch(origin + path, {
      method,
      headers: { 'content-type': 'application/json' },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    })
    const text = await upstream.text()
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    })
    res.end(text)
  } catch {
    res.writeHead(502, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'backend unreachable' }))
  }
}
