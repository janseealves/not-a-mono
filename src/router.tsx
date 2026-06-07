import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from './App'
import { RagPage } from './pages/RagPage'

// Uma rota por módulo do not-a-monolith. Novos módulos (ocr, agents...)
// entram aqui quando existirem no backend.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/rag" replace /> },
      { path: 'rag', element: <RagPage /> },
    ],
  },
])
