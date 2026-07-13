import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from './App'
import { AgentPage } from './pages/AgentPage'

// Demo pública (sem auth) em /demo — sessão com o Agent, threads persistidas
// no navegador. A thread ativa é estado, não rota: o id não deveria vazar na
// URL (é só uma chave de armazenamento local, não um recurso navegável entre
// dispositivos — cada navegador só enxerga as próprias threads). Novos
// módulos do backend entram aqui quando existirem.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/demo" replace /> },
      { path: 'demo', element: <AgentPage /> },
    ],
  },
])
