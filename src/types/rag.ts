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

export interface AskResponse {
  answer: string
}

export interface HealthResponse {
  status: string
}
