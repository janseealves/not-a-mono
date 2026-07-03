import { useEffect, useRef, useState } from 'react'

import { createCollection } from '../api/collections'
import { ApiError } from '../api/client'

const STORAGE_KEY = 'mono-ui:collection-id'

// Uma collection por browser: isola o índice desta "sessão" das demais sem
// exigir login. Criada uma vez no backend, o id persiste em localStorage e
// sobrevive a reloads — igual ao que useSources já faz para a lista de fontes.
export function useCollection() {
  const [collectionId, setCollectionId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )
  const [error, setError] = useState<ApiError | null>(null)
  // Trava a criação de verdade (não só o setState): em StrictMode o efeito
  // roda 2x em dev e um `cancelled` local não impede a segunda chamada de rede.
  const creating = useRef(false)

  useEffect(() => {
    if (collectionId || creating.current) return
    creating.current = true

    createCollection(`browser-${crypto.randomUUID()}`)
      .then((collection) => {
        localStorage.setItem(STORAGE_KEY, collection.id)
        setCollectionId(collection.id)
      })
      .catch((err: unknown) => {
        creating.current = false
        setError(err instanceof ApiError ? err : new ApiError('failed to create collection'))
      })
  }, [collectionId])

  return { collectionId, ready: collectionId !== null, error }
}
