import { type RefObject, useEffect } from 'react'

// Fecha em qualquer clique fora do container — inclusive dentro de overlays
// com backdrop-blur. Um overlay fixed inset-0 não serve nesse caso: o blur
// cria um containing block que prende um filho fixed ao tamanho da barra, não
// da tela.
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return

    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [active, ref, onOutside])
}
