import { Outlet } from 'react-router-dom'

// Casca mínima: cada módulo ocupa a tela inteira e monta o próprio cabeçalho.
export function AppShell() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  )
}
