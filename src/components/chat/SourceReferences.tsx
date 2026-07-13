import type { SourceInfo } from '../../types/agent'

interface SourceReferencesProps {
  sources: SourceInfo[]
}

function docName(source: string): string {
  try {
    const url = new URL(source)
    const path = url.pathname === '/' ? '' : url.pathname
    return `${url.hostname}${path}`.replace(/\/$/, '')
  } catch {
    return source
  }
}

// As referências que o agente usou nesta resposta — dobrado por padrão, como
// o detalhe de uma ferramenta no claude.ai. SourceInfo só tem o documento e os
// ids de chunk (sem trecho/score), então a lista é por documento, não por chunk.
export function SourceReferences({ sources }: SourceReferencesProps) {
  if (sources.length === 0) return null
  const totalChunks = sources.reduce((n, s) => n + s.chunk_ids.length, 0)

  return (
    <details className="group mt-1">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-slate transition-colors hover:text-bone [&::-webkit-details-marker]:hidden">
        <span className="text-amber transition-transform group-open:rotate-90">▸</span>
        {sources.length} {sources.length === 1 ? 'referência' : 'referências'} · {totalChunks}{' '}
        {totalChunks === 1 ? 'trecho' : 'trechos'}
      </summary>
      <div className="mt-3 flex flex-col gap-1.5 border-l border-hair pl-3">
        {sources.map((s) => (
          <div key={s.source} className="flex items-center justify-between gap-2 text-[11px]">
            <span title={s.source} className="truncate text-slate">
              {docName(s.source)}
            </span>
            <span className="shrink-0 tabular-nums text-slate/60">{s.chunk_ids.length}</span>
          </div>
        ))}
      </div>
    </details>
  )
}
