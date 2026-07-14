import { useMutation } from '@tanstack/react-query'

import { ingest } from '../api/rag'

export function useIngest(collectionId: string | null, onIngested: (url: string) => void) {
  return useMutation({
    mutationFn: (url: string) => {
      if (!collectionId) throw new Error('collection ainda não está pronta')
      return ingest(collectionId, url)
    },
    onSuccess: (_data, url) => onIngested(url),
  })
}
