import type { AskResponse, IngestResponse, SearchResponse } from '../types/rag'
import { post } from './client'

export const ingest = (source: string) =>
  post<IngestResponse>('/v1/rag/ingest', { source })

export const search = (query: string, topK: number) =>
  post<SearchResponse>('/v1/rag/search', { query, top_k: topK })

export const ask = (query: string, topK: number) =>
  post<AskResponse>('/v1/rag/ask', { query, top_k: topK })
