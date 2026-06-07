import { useMutation } from '@tanstack/react-query'

import { ask, search } from '../api/rag'
import type { RetrievedChunk } from '../types/rag'

export interface AskInput {
  query: string
  topK: number
}

export interface AskResult {
  query: string
  answer: string
  chunks: RetrievedChunk[]
  latencyMs: number
  topK: number
  /** o ask respondeu mas o search (que alimenta o inspector) falhou */
  searchFailed: boolean
}

// O /ask não retorna os chunks — disparamos search + ask em paralelo com a
// mesma query/top_k: o ask vira a resposta do MONO, o search alimenta o
// inspector. Se só o search falhar, a resposta segue sem o detalhe.
export function useAsk() {
  return useMutation({
    mutationFn: async ({ query, topK }: AskInput): Promise<AskResult> => {
      const started = performance.now()
      const [searchRes, askRes] = await Promise.allSettled([
        search(query, topK),
        ask(query, topK),
      ])
      const latencyMs = performance.now() - started

      if (askRes.status === 'rejected') throw askRes.reason

      return {
        query,
        answer: askRes.value.answer,
        chunks: searchRes.status === 'fulfilled' ? searchRes.value.results : [],
        searchFailed: searchRes.status === 'rejected',
        latencyMs,
        topK,
      }
    },
  })
}
