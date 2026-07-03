import { useCallback, useState } from 'react'

const STORAGE_PREFIX = 'mono-ui:sources'

function readSources(collectionId: string | null): string[] {
  if (!collectionId) return []
  try {
    return JSON.parse(
      localStorage.getItem(`${STORAGE_PREFIX}:${collectionId}`) ?? '[]',
    ) as string[]
  } catch {
    return []
  }
}

// Fontes ingeridas nesta collection (client-side), escopadas por collection_id
// pra não herdar o histórico de uma collection anterior (ex.: a guardada no
// browser ficou órfã e useCollection criou outra). O índice real é o Postgres —
// isto só registra "o que esta collection recebeu", pra alimentar o painel.
export function useSources(collectionId: string | null) {
  const [sources, setSources] = useState<string[]>(() => readSources(collectionId))
  // Ajusta o estado durante o render quando a collection muda, em vez de via
  // useEffect (padrão do React p/ "resetar" estado a partir de uma prop).
  const [readFor, setReadFor] = useState(collectionId)
  if (collectionId !== readFor) {
    setReadFor(collectionId)
    setSources(readSources(collectionId))
  }

  const addSource = useCallback(
    (url: string) => {
      if (!collectionId) return
      setSources((prev) => {
        const next = prev.includes(url) ? prev : [...prev, url]
        localStorage.setItem(`${STORAGE_PREFIX}:${collectionId}`, JSON.stringify(next))
        return next
      })
    },
    [collectionId],
  )

  return { sources, addSource }
}
