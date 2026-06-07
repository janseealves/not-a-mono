import { useEffect, useState } from 'react'

// Loop de "pensamento": t oscila 0 → 1 → 0 enquanto ativo.
// Com prefers-reduced-motion, congela na pose articulada.
export function useSlabPulse(active: boolean): number {
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!active) {
      setT(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(1)
      return
    }
    let raf = 0
    let x = 0
    const loop = () => {
      x += 0.04
      setT(Math.sin(x - Math.PI / 2) * 0.5 + 0.5)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return t
}
