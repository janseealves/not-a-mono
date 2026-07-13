import { useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import type { ThreadsApi } from '../components/shell/AppShell'

// Resolve /demo (sem :threadId) pra uma thread concreta: reusa a ativa se
// ainda existir, senão a mais recente, senão cria uma. Guard `started` evita
// criar duas threads no double-invoke do StrictMode em dev.
export function AgentIndexRedirect() {
  const navigate = useNavigate()
  const threadsApi = useOutletContext<ThreadsApi>()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const { threads, activeThreadId, createThread, setActiveThreadId } = threadsApi
    if (activeThreadId && threads.some((t) => t.id === activeThreadId)) {
      navigate(`/demo/${activeThreadId}`, { replace: true })
      return
    }
    if (threads.length > 0) {
      setActiveThreadId(threads[0].id)
      navigate(`/demo/${threads[0].id}`, { replace: true })
      return
    }
    const thread = createThread()
    setActiveThreadId(thread.id)
    navigate(`/demo/${thread.id}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
