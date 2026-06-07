import { monoVoice } from '../../voice/mono'

interface SourceListProps {
  sources: string[]
  online: boolean
}

export function SourceList({ sources, online }: SourceListProps) {
  if (sources.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-1.5">
        {sources.map((url) => (
          <li
            key={url}
            title={url}
            className="truncate border-l-2 border-steel pl-2 text-[11px] text-slate"
          >
            {url.replace(/^https?:\/\//, '')}
          </li>
        ))}
      </ul>
      <p className="text-[9px] leading-relaxed text-slate/60">
        {online ? monoVoice.sourcesEphemeral : monoVoice.offlineWarning}
      </p>
    </div>
  )
}
