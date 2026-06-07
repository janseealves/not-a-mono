import { MonoSlab } from './MonoSlab'

interface MonoBadgeProps {
  size?: number
  /** dobra da laje: 0 = repouso */
  t?: number
}

// O selo: figura preta sobre campo âmbar — o único lugar onde o âmbar é chão.
export function MonoBadge({ size = 40, t = 0 }: MonoBadgeProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-amber text-figure"
      style={{ width: size, height: size, borderRadius: '22%' }}
    >
      <MonoSlab size={size} t={t} />
    </div>
  )
}
