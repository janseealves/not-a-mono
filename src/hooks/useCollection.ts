import { useEffect, useRef, useState } from 'react'

import { ApiError } from '../api/client'
import { createCollection, listCollections } from '../api/collections'

const STORAGE_KEY = 'mono-ui:collection-id'

// Uma collection por browser: isola o índice desta "sessão" das demais sem
// exigir login. Criada uma vez no backend, o id persiste em localStorage e
// sobrevive a reloads — igual ao que useSources faz para a lista de fontes.
export function useCollection() {
  const [collectionId, setCollectionId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )
  const [error, setError] = useState<ApiError | null>(null)
  // Roda uma única vez por montagem (StrictMode dispara o efeito 2x em dev).
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const create = () =>
      createCollection(`browser-${crypto.randomUUID()}`).then((collection) => {
        localStorage.setItem(STORAGE_KEY, collection.id)
        setCollectionId(collection.id)
      })

    // O id guardado pode ter ficado órfão (banco resetado, collection apagada
    // etc.) — valida contra o backend antes de confiar nele "pra sempre".
    const stored = localStorage.getItem(STORAGE_KEY)
    const ensure = stored
      ? listCollections().then((collections) =>
          collections.some((c) => c.id === stored) ? undefined : create(),
        )
      : create()

    ensure.catch((err: unknown) => {
      started.current = false
      setError(err instanceof ApiError ? err : new ApiError('failed to prepare collection'))
    })
  }, [])

  return { collectionId, ready: collectionId !== null, error }
}
