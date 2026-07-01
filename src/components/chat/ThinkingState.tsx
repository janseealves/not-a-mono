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
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const stageId = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      2200,
    )
    const clockId = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => {
      clearInterval(stageId)
      clearInterval(clockId)
    }
  }, [])

  const current = STAGES[stage]

  return (
    <div className="flex gap-3">
      <MonoBadge size={26} t={t} />
      <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate">
          mono · {slabLabel(t)}
          {elapsed >= 3 && <span className="text-slate/60"> · {elapsed}s</span>}
        </span>
        <span className="text-[13px] text-slate">
          <span className="text-amber">{current.name}</span>{' '}
          <span className="text-slate/60">— {current.desc}…</span>
        </span>
        <div className="mt-1 max-w-[180px]">
          <div className="mono-progress" />
        </div>
      </div>
    </div>
  )
}
