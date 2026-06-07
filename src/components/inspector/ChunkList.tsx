import type { RetrievedChunk } from '../../types/rag'
import { monoVoice } from '../../voice/mono'

interface ChunkListProps {
  chunks: RetrievedChunk[]
  searchFailed: boolean
}

export function ChunkList({ chunks, searchFailed }: ChunkListProps) {
  if (searchFailed) {
    return <p className="text-[11px] leading-relaxed text-ember">{monoVoice.searchFailed}</p>
  }
  if (chunks.length === 0) {
    return <p className="text-[11px] leading-relaxed text-slate">{monoVoice.noChunks}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {chunks.map((chunk, i) => (
        <article
          key={i}
          className="rounded-[3px] border border-hair bg-surface p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-[10px] font-medium text-amber">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-[10px] text-bone">
              {chunk.score.toFixed(3)}
            </span>
          </div>
          {/* barra de score — âmbar sobre trilho de aço */}
          <div className="mb-2 h-[2px] w-full bg-steel">
            <div
              className="h-full bg-amber"
              style={{ width: `${Math.min(Math.max(chunk.score, 0), 1) * 100}%` }}
            />
          </div>
          <p className="line-clamp-5 text-[11px] leading-relaxed text-slate">
            {chunk.content}
          </p>
        </article>
      ))}
    </div>
  )
}
