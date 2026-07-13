import { createContext, useContext } from 'react'

// Só o drawer mobile (clique) usa isto. O trilho desktop expande no hover e
// tem estado próprio, local a DesktopSidebarRail — os dois já dividiram um
// `open` só e o hover do trilho acabava abrindo o drawer mobile sozinho
// sempre que o cursor ficava sobre a área do trilho antes do viewport
// encolher pra mobile. Não repetir isso.
export interface MobileDrawerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

export const MobileDrawerContext = createContext<MobileDrawerContextValue | undefined>(undefined)

export function useMobileDrawer(): MobileDrawerContextValue {
  const ctx = useContext(MobileDrawerContext)
  if (!ctx) throw new Error('useMobileDrawer deve ser usado dentro de <MobileDrawerProvider>')
  return ctx
}
