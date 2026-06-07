import type { AskResult } from '../../hooks/useAsk'
import { monoLatency, monoVoice } from '../../voice/mono'
import { SectionLabel } from '../shell/SectionLabel'
import { ChunkList } from './ChunkList'
import { IngestPanel } from './IngestPanel'
import { SourceList } from './SourceList'
import { TopKControl } from './TopKControl'

interface InspectorPanelProps {
  lastRun: AskResult | null
  topK: number
  onTopKChange: (k: number) => void
  sources: string[]
  online: boolean
  onIngested: (url: string) => void
}

// O painel técnico: o que o RAG fez por baixo da última resposta.
export function InspectorPanel({
  lastRun,
  topK,
  onTopKChange,
  sources,
  online,
  onIngested,
}: InspectorPanelProps) {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-7 overflow-y-auto border-l border-hair px-5 py-6">
      <SectionLabel>inspector</SectionLabel>

      <TopKControl value={topK} onChange={onTopKChange} />

      <div className="flex flex-col gap-3 border-t border-hair pt-5">
        <SectionLabel>última recuperação</SectionLabel>
        {lastRun ? (
          <>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
              <span className="text-slate">latência</span>
              <span className="font-display font-medium text-bone">
                {monoLatency(lastRun.latencyMs, lastRun.topK)}
              </span>
            </div>
            <ChunkList chunks={lastRun.chunks} searchFailed={lastRun.searchFailed} />
          </>
        ) : (
          <p className="text-[11px] leading-relaxed text-slate">
            {monoVoice.inspectorIdle}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-hair pt-5">
        <SectionLabel>ingest</SectionLabel>
        <IngestPanel onIngested={onIngested} />
        <SourceList sources={sources} online={online} />
      </div>
    </aside>
  )
}
