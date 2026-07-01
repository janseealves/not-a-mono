import { useState } from 'react'

import { IngestPanel } from '../inspector/IngestPanel'
import { SourceList } from '../inspector/SourceList'
import { TopKControl } from '../inspector/TopKControl'

interface SourcesControlProps {
  topK: number
  onTopKChange: (k: number) => void
  sources: string[]
  online: boolean
  onIngested: (url: string) => void
}

// Tudo que era o inspector cabe aqui: ingerir fontes, ajustar top_k, ver o índice.
// Fica fora do caminho até você precisar — como um menu do claude.ai.
export function SourcesControl({
  topK,
  onTopKChange,
  sources,
  online,
  onIngested,
}: SourcesControlProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[11px] transition-colors ${
          open
            ? 'border-amber text-amber'
            : 'border-hair text-slate hover:border-slate/40 hover:text-bone'
        }`}
      >
        fontes
        <span className="font-medium tabular-nums">{sources.length}</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="fechar"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-30 mt-2 flex w-[280px] flex-col gap-5 rounded-lg border border-hair bg-surface p-4 shadow-lg shadow-black/5">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate">
                indexar url
              </span>
              <IngestPanel onIngested={onIngested} />
            </div>

            <div className="border-t border-hair pt-4">
              <TopKControl value={topK} onChange={onTopKChange} />
            </div>

            {sources.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-hair pt-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate">
                  índice · {sources.length}
                </span>
                <SourceList sources={sources} online={online} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
