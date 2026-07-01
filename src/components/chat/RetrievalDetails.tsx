import type { AskResult } from '../../hooks/useAsk'
import { ChunkList } from '../inspector/ChunkList'

interface RetrievalDetailsProps {
  run: AskResult
}

// O que o RAG recuperou por trás da resposta — dobrado por padrão, como o
// detalhe de uma ferramenta no claude.ai. Aberto sob demanda.
export function RetrievalDetails({ run }: RetrievalDetailsProps) {
  const count = run.chunks.length
  const seconds = (run.latencyMs / 1000).toFixed(2)

  const summary = run.searchFailed
    ? 'recuperação indisponível'
    : `${count} ${count === 1 ? 'fonte' : 'fontes'} · ${seconds}s · top ${run.topK}`

  return (
    <details className="group mt-1">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-slate transition-colors hover:text-bone [&::-webkit-details-marker]:hidden">
        <span className="text-amber transition-transform group-open:rotate-90">▸</span>
        {summary}
      </summary>
      <div className="mt-3 border-l border-hair pl-3">
        <ChunkList chunks={run.chunks} searchFailed={run.searchFailed} />
      </div>
    </details>
  )
}
