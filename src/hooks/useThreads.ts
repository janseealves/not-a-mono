import { useCallback, useState } from 'react'

import {
  type Thread,
  deleteThreadStorage,
  nextThreadTitle,
  readActiveThreadId,
  readThreads,
  writeActiveThreadId,
  writeThreads,
} from '../lib/agentStorage'

const byRecency = (a: Thread, b: Thread) => b.updatedAt.localeCompare(a.updatedAt)

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>(() => [...readThreads()].sort(byRecency))
  const [activeThreadId, setActiveThreadIdState] = useState<string | null>(() =>
    readActiveThreadId(),
  )

  const persist = useCallback((next: Thread[]) => {
    writeThreads(next)
    setThreads([...next].sort(byRecency))
  }, [])

  const createThread = useCallback((): Thread => {
    const now = new Date().toISOString()
    const thread: Thread = {
      id: crypto.randomUUID(),
      title: nextThreadTitle(),
      createdAt: now,
      updatedAt: now,
    }
    persist([...readThreads(), thread])
    return thread
  }, [persist])

  const renameThread = useCallback(
    (id: string, title: string) => {
      persist(readThreads().map((t) => (t.id === id ? { ...t, title } : t)))
    },
    [persist],
  )

  const deleteThread = useCallback((id: string) => {
    deleteThreadStorage(id)
    setThreads((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Chamado quando a 1ª mensagem de uma thread nova define o título, e a cada
  // mensagem pra manter a ordenação da sidebar por "mais recente primeiro".
  const touchThread = useCallback(
    (id: string, patch?: Partial<Pick<Thread, 'title'>>) => {
      const now = new Date().toISOString()
      persist(readThreads().map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now } : t)))
    },
    [persist],
  )

  const setActiveThreadId = useCallback((id: string) => {
    writeActiveThreadId(id)
    setActiveThreadIdState(id)
  }, [])

  return {
    threads,
    activeThreadId,
    createThread,
    renameThread,
    deleteThread,
    touchThread,
    setActiveThreadId,
  }
}
