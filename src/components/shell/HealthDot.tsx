interface HealthDotProps {
  online: boolean
}

// Estado da API, discreto no cabeçalho: ponto + rótulo.
export function HealthDot({ online }: HealthDotProps) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] lowercase tracking-[0.05em]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          online ? 'bg-amber shadow-[0_0_8px_rgba(234,88,12,0.5)]' : 'bg-ember'
        }`}
      />
      <span className={online ? 'text-slate' : 'text-ember'}>
        {online ? 'online' : 'offline'}
      </span>
    </span>
  )
}
