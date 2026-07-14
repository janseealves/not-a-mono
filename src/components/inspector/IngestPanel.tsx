import { useState } from 'react'

import { ApiError } from '../../api/client'
import { useIngest } from '../../hooks/useIngest'
import { agentVoice } from '../../voice/agent'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface IngestPanelProps {
  collectionId: string | null
  onIngested: (url: string) => void
}

export function IngestPanel({ collectionId, onIngested }: IngestPanelProps) {
  const [url, setUrl] = useState('')
  const ingest = useIngest(collectionId, (ingested) => {
    onIngested(ingested)
    setUrl('')
  })

  const errorMessage =
    ingest.error instanceof ApiError && ingest.error.isOffline
      ? agentVoice.ingestOffline
      : agentVoice.ingestError

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const source = url.trim()
        if (source && !ingest.isPending) ingest.mutate(source)
      }}
    >
      <Input
        type="url"
        required
        value={url}
        disabled={ingest.isPending}
        placeholder="https://…"
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button type="submit" variant="secondary" disabled={ingest.isPending || !url.trim() || !collectionId}>
        {ingest.isPending ? 'indexando…' : 'indexar'}
      </Button>
      {ingest.isPending && (
        <div className="flex flex-col gap-1.5">
          <div className="mono-progress" />
          <p className="text-[10px] leading-relaxed text-slate/70">
            raspando e indexando a página — pode levar alguns segundos.
          </p>
        </div>
      )}
      {ingest.isError && (
        <p className="text-[10px] leading-relaxed text-ember">{errorMessage}</p>
      )}
    </form>
  )
}
