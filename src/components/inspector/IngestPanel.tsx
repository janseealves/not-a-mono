import { useState } from 'react'

import { ApiError } from '../../api/client'
import { useIngest } from '../../hooks/useIngest'
import { monoVoice } from '../../voice/mono'

interface IngestPanelProps {
  onIngested: (url: string) => void
}

export function IngestPanel({ onIngested }: IngestPanelProps) {
  const [url, setUrl] = useState('')
  const ingest = useIngest((ingested) => {
    onIngested(ingested)
    setUrl('')
  })

  const errorMessage =
    ingest.error instanceof ApiError && ingest.error.isOffline
      ? monoVoice.ingestOffline
      : monoVoice.ingestError

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const source = url.trim()
        if (source && !ingest.isPending) ingest.mutate(source)
      }}
    >
      <input
        type="url"
        required
        value={url}
        disabled={ingest.isPending}
        placeholder="https://…"
        className="rounded-[3px] border border-hair bg-surface px-3 py-2 text-[12px] text-bone placeholder:text-slate/50 focus:border-steel focus:outline-none disabled:opacity-50"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="submit"
        disabled={ingest.isPending || !url.trim()}
        className="rounded-[3px] border border-steel px-3 py-2 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ingest.isPending ? 'indexando…' : 'indexar'}
      </button>
      {ingest.isError && (
        <p className="text-[10px] leading-relaxed text-ember">{errorMessage}</p>
      )}
    </form>
  )
}
