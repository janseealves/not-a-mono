// Espelha os schemas Pydantic de not-a-monolith/interfaces/api/schemas/rag.py

export interface IngestRequest {
  source: string // HttpUrl — validado no servidor
}

export interface IngestResponse {
  message: string
}

export interface QueryRequest {
  query: string
  top_k: number // 1–20, default 5
}

export interface RetrievedChunk {
  content: string
  score: number
}

export interface SearchResponse {
  results: RetrievedChunk[]
}

// /ask agora responde em SSE (ver api/client.ts:postStream) em vez de um JSON único.

export interface HealthResponse {
  status: string
}

// Espelha interfaces/api/schemas/collection.py

export interface CreateCollectionRequest {
  name: string
  description?: string | null
}

export interface Collection {
  id: string // external_id (uuid) — é o que entra na URL
  name: string
  description: string | null
  created_at: string
}
