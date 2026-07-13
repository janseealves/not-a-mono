import { useCallback, useEffect, useRef, useState } from 'react'

import { ApiError } from '../api/client'
import { createCollection, listCollections } from '../api/collections'

const STORAGE_KEY = 'mono-ui:collection-id'

// Uma collection por navegador: isola o índice desta "sessão" das demais sem
// exigir login. Criada uma vez no backend, o id persiste em localStorage e
// sobrevive a reloads. Sem picker, sem criação manual — é tudo automático e
// invisível pro visitante; a limpeza do lado do backend é responsabilidade
// de quem administra a demo (não desta camada).
export function useCollection() {
  const [collectionId, setCollectionId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )
  const [error, setError] = useState<ApiError | null>(null)
  // Roda uma única vez por montagem (StrictMode dispara o efeito 2x em dev).
  const started = useRef(false)

  const create = useCallback(() => {
    return createCollection(`browser-${crypto.randomUUID()}`).then((collection) => {
      localStorage.setItem(STORAGE_KEY, collection.id)
      setCollectionId(collection.id)
    })
  }, [])

  useEffect(() => {
    if (started.current) return
    started.current = true

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
  }, [create])

  // Chamado quando um 404 no meio de uma conversa revela que a collection
  // guardada não existe mais no backend (ex.: limpeza periódica) — descarta
  // o id velho e provisiona um novo pra próxima mensagem já funcionar.
  const invalidate = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setCollectionId(null)
    void create()
  }, [create])

  return { collectionId, ready: collectionId !== null, error, invalidate }
}
