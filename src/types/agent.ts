// Espelha o schema Pydantic de not-a-monolith/interfaces/api/schemas/agent.py
// e o dataclass SourceInfo de monolith/rag/service.py.

export interface ChatRequest {
  message: string
  thread_id: string
  collection_id?: string | null
}

export interface SourceInfo {
  source: string
  chunk_ids: string[]
}

// O SSE de /agent/chat intercala tokens de texto com zero ou mais eventos
// 'sources' (o agente decide em runtime se/quando chama a tool de busca).
export type AgentStreamEvent =
  | { type: 'token'; content: string }
  | { type: 'sources'; sources: SourceInfo[] }
