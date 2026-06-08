import { useEffect, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// prefers-reduced-motion é um sistema externo: lido via useSyncExternalStore,
// reage até a mudança da preferência do SO com o app aberto.
const subscribeReducedMotion = (onChange: () => void) => {
  const mql = window.matchMedia(REDUCED_MOTION)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches

// Loop de "pensamento": t oscila 0 → 1 → 0 enquanto ativo.
// Com prefers-reduced-motion, congela na pose articulada.
export function useSlabPulse(active: boolean): number {
  const [t, setT] = useState(0)
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion)

  useEffect(() => {
    if (!active || reducedMotion) return
    let raf = 0
    let x = 0
    const loop = () => {
      x += 0.04
      setT(Math.sin(x - Math.PI / 2) * 0.5 + 0.5)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active, reducedMotion])

  // Poses fixas são deriváveis no render — não precisam de setState no effect.
  if (!active) return 0
  if (reducedMotion) return 1
  return t
}
