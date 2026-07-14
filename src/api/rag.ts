import type { IngestResponse } from '../types/rag'
import { post } from './client'

// source_type padrão do backend é 'web' — a UI só oferece URL por enquanto.
export const ingest = (collectionId: string, source: string) =>
  post<IngestResponse>(`/v1/rag/collections/${collectionId}/ingest`, { source })
