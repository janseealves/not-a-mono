import { useQuery } from '@tanstack/react-query'

import { getHealth } from '../api/meta'

export function useHealth() {
  const query = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 10_000,
  })
  return { ...query, online: query.data?.status === 'healthy' && !query.isError }
}
