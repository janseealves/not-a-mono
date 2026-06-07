import { useHealth } from '../../hooks/useHealth'

export function HealthIndicator() {
  const { online } = useHealth()

  return (
    <div className="flex items-center justify-between border-t border-hair pt-4 text-[10px] uppercase tracking-[0.18em]">
      <span className="text-slate">api</span>
      <span className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            online ? 'bg-amber shadow-[0_0_8px_rgba(255,176,46,0.6)]' : 'bg-ember'
          }`}
        />
        <span className={`font-display font-medium ${online ? 'text-bone' : 'text-ember'}`}>
          {online ? 'online' : 'offline'}
        </span>
      </span>
    </div>
  )
}
