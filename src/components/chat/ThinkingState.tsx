import { useEffect, useState } from 'react'

import { slabLabel } from '../../voice/mono'
import { MonoBadge } from '../mono/MonoBadge'
import { useSlabPulse } from '../mono/useSlabPulse'

// Estágios do grafo (brandbook §06) — o ingest acontece fora do ask.
const STAGES = [
  { n: '02', name: 'retrieve', desc: 'buscando no índice' },
  { n: '03', name: 'reason', desc: 'os nós deliberam' },
  { n: '04', name: 'respond', desc: 'fechando a resposta' },
]

// MONO pensando: a laje dobra e o readout percorre os estágios do grafo.
export function ThinkingState() {
  const t = useSlabPulse(true)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      2200,
    )
    return () => clearInterval(id)
  }, [])

  const current = STAGES[stage]

  return (
    <div className="flex items-center gap-3">
      <MonoBadge size={28} t={t} />
      <div className="flex flex-col gap-1 pt-0.5">
        <span className="font-display text-[9px] uppercase tracking-[0.22em] text-slate">
          mono · {slabLabel(t)}
        </span>
        <span className="font-display text-[12px] text-slate">
          <span className="text-amber">{current.n}</span> {current.name}{' '}
          <span className="text-slate/60">— {current.desc}…</span>
        </span>
      </div>
    </div>
  )
}
