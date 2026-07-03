import type { IngestResponse, SearchResponse } from '../types/rag'
import { post, postStream } from './client'

export const ingest = (collectionId: string, source: string) =>
  post<IngestResponse>(`/v1/rag/collections/${collectionId}/ingest`, { source })

export const search = (collectionId: string, query: string, topK: number) =>
  post<SearchResponse>(`/v1/rag/collections/${collectionId}/search`, {
    query,
    top_k: topK,
  })

export const streamAsk = (collectionId: string, query: string, topK: number) =>
  postStream(`/v1/rag/collections/${collectionId}/ask`, { query, top_k: topK })
