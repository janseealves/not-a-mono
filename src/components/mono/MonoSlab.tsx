// A laje do MONO — 4 segmentos que dobram 16° em direções alternadas.
// Geometria portada de mono-brand/mono-brand-canvas.html.

const THETA = 16
const DIRS = [-1, 1, -1, 1]

function rot(
  px: number,
  py: number,
  ox: number,
  oy: number,
  deg: number,
): [number, number] {
  const a = (deg * Math.PI) / 180
  const dx = px - ox
  const dy = py - oy
  return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a)]
}

interface MonoSlabProps {
  /** lado do quadrado em px */
  size?: number
  /** dobra: 0 = monolito, 1 = articulado */
  t: number
  className?: string
}

// Componente puro: t → transforms. Os segmentos herdam currentColor,
// então a cor vem do contexto (figura preta sobre âmbar, ou âmbar na UI).
export function MonoSlab({ size = 56, t, className }: MonoSlabProps) {
  const S = size
  const W = S * 0.3
  const H = S * 0.142
  const GAP = S * 0.026
  const cx = S / 2
  const angles = DIRS.map((d) => d * THETA * t)

  // passo 1: extensão vertical, para centralizar
  let P: [number, number] = [cx, 0]
  const ys = [0]
  for (const a of angles) {
    P = rot(P[0], P[1] + H + GAP, P[0], P[1], a)
    ys.push(P[1])
  }
  const span = Math.max(...ys) - Math.min(...ys)
  const yoff = (S - span) / 2 - Math.min(...ys)

  // passo 2: posicionar cada segmento a partir da junta anterior
  const segs: { x: number; y: number; a: number }[] = []
  P = [cx, yoff]
  for (const a of angles) {
    segs.push({ x: P[0] - W / 2, y: P[1], a })
    P = rot(P[0], P[1] + H + GAP, P[0], P[1], a)
  }

  return (
    <div
      aria-hidden
      className={`relative ${className ?? ''}`}
      style={{ width: S, height: S }}
    >
      {segs.map((s, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 origin-top bg-current will-change-transform"
          style={{
            width: W,
            height: H,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.a}deg)`,
          }}
        />
      ))}
    </div>
  )
}
