import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export function useCrossReference(entityType: 'contract' | 'process', entityId: string) {
  return useQuery({
    queryKey: ['cross-reference', entityType, entityId],
    queryFn: () => apiClient.getCrossReferences(entityType, entityId),
    enabled: !!entityId,
  })
}

