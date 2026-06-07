import { useMutation } from '@tanstack/react-query'

import { ingest } from '../api/rag'

export function useIngest(onIngested: (url: string) => void) {
  return useMutation({
    mutationFn: (url: string) => ingest(url),
    onSuccess: (_data, url) => onIngested(url),
  })
}
