import { useMutation } from '@tanstack/react-query'

import { streamAsk } from '../api/rag'
import type { RetrievedChunk } from '../types/rag'

export interface AskInput {
  collectionId: string
  query: string
  topK: number
  /** chamado a cada token recebido do /ask, pra atualizar a bolha em tempo real */
  onToken: (token: string) => void
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

// Referências desativadas por enquanto: a API da VPS ainda não expõe um GET de
// document e o comportamento de cache do /search não é o esperado. Por isso só
// chamamos /ask — sem chunks recuperados. Para reativar, volte a disparar
// search() em paralelo e preencha `chunks`/`searchFailed`.
export function useAsk() {
  return useMutation({
    mutationFn: async ({
      collectionId,
      query,
      topK,
      onToken,
    }: AskInput): Promise<AskResult> => {
      const started = performance.now()
      let answer = ''
      for await (const token of streamAsk(collectionId, query, topK)) {
        answer += token
        onToken(token)
      }
      const latencyMs = performance.now() - started

      return { query, answer, chunks: [], searchFailed: false, latencyMs, topK }
    },
  })
}
