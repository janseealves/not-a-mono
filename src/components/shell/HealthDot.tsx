import { Dot } from '../ui/Dot'

interface HealthDotProps {
  online: boolean
}

// Estado da API, discreto no cabeçalho: ponto + rótulo.
export function HealthDot({ online }: HealthDotProps) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] lowercase tracking-[0.05em]">
      <Dot tone={online ? 'online' : 'offline'} />
      <span className={online ? 'text-slate' : 'text-ember'}>
        {online ? 'online' : 'offline'}
      </span>
    </span>
  )
}
