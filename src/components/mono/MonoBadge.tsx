import { MonoSlab } from './MonoSlab'

interface MonoBadgeProps {
  size?: number
  /** dobra da laje: 0 = repouso, 1 = articulado */
  t?: number
}

// O selo: figura vazada sobre campo laranja — o único lugar onde o laranja é chão.
// Pose padrão = articulado, a mesma do favicon: parado, o MONO é um monolito e a
// piada não aparece. Quem quer o repouso (ou a dobra em curso) passa t — é o que
// o ThinkingState faz com o useSlabPulse.
export function MonoBadge({ size = 40, t = 1 }: MonoBadgeProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-amber text-figure"
      style={{ width: size, height: size, borderRadius: '22%' }}
    >
      <MonoSlab size={size} t={t} />
    </div>
  )
}
