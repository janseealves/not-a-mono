import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from './App'
import { AgentIndexRedirect } from './pages/AgentIndexRedirect'
import { AgentPage } from './pages/AgentPage'

// Demo pública (sem auth) em /demo — sessão com o Agent, threads persistidas
// no navegador. Novos módulos do backend entram aqui quando existirem.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/demo" replace /> },
      { path: 'demo', element: <AgentIndexRedirect /> },
      { path: 'demo/:threadId', element: <AgentPage /> },
    ],
  },
])
