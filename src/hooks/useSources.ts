import { useCallback, useState } from 'react'

const STORAGE_KEY = 'mono-ui:sources'

// Fontes ingeridas nesta sessão (client-side). O vector store do backend é
// em memória — isto registra "o que esta sessão enviou", não o que o índice
// necessariamente ainda contém.
export function useSources() {
  const [sources, setSources] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
    } catch {
      return []
    }
  })

  // TODO: limpar fontes ao detectar que o backend reiniciou (e perdeu o índice em memória). 
  const addSource = useCallback((url: string) => {
    setSources((prev) => {
      const next = prev.includes(url) ? prev : [...prev, url]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { sources, addSource }
}
