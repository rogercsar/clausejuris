import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import type { CrossReference } from '@/types'

function mapCrossRefRow(row: any): CrossReference {
  return {
    entityId: row.entity_id,
    entityType: row.entity_type,
    entityName: row.entity_name,
    relationType: row.relation_type,
    details: row.details,
    riskLevel: row.risk_level ?? undefined,
  }
}

export function useCrossReference(entityType: 'contract' | 'process', entityId: string) {
  return useQuery({
    queryKey: ['cross-reference', entityType, entityId],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data, error } = await supabase
          .from('cross_references')
          .select('*')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []).map(mapCrossRefRow)
      }
      return apiClient.getCrossReferences(entityType, entityId)
    },
    enabled: !!entityId,
  })
}

