import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useContractsStore } from '@/store/contracts'
import { apiClient } from '@/lib/api'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import type { Contract, ContractStatus, ContractType } from '@/types'

function mapContractRow(row: any): Contract {
  return {
    id: row.id,
    type: row.type,
    clientId: row.client_id,
    clientName: row.client_name,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    value: Number(row.value),
    status: row.status,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useContracts(filters?: { status?: ContractStatus; type?: ContractType }) {
  const { setContracts } = useContractsStore()

  const query = useQuery({
    queryKey: ['contracts', filters],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        let builder = supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false })
        if (filters?.status) builder = builder.eq('status', filters.status)
        if (filters?.type) builder = builder.eq('type', filters.type)
        const { data, error } = await builder
        if (error) throw error
        return (data ?? []).map(mapContractRow)
      }
      return apiClient.getContracts(filters)
    },
  })

  useEffect(() => {
    if (query.data) {
      setContracts(query.data)
    }
  }, [query.data, setContracts])

  return query
}

export function useCreateContract() {
  const { addContract } = useContractsStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (hasSupabaseConfig) {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')

        const insertRow: any = {
          user_id: uid,
          client_id: data.clientId,
          client_name: data.clientName,
          type: data.type,
          start_date: data.startDate,
          end_date: data.endDate || null,
          value: data.value,
          status: data.status,
          attachments: data.attachments ?? [],
          description: data.description ?? null,
        }
        const { data: inserted, error } = await supabase
          .from('contracts')
          .insert(insertRow)
          .select('*')
        if (error) throw error
        const row = Array.isArray(inserted) ? inserted[0] : inserted
        return mapContractRow(row)
      }
      return apiClient.createContract(data)
    },
    onSuccess: (contract) => {
      addContract(contract)
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useUpdateContract() {
  const { updateContract } = useContractsStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contract> }) => {
      if (hasSupabaseConfig) {
        const updates: any = {
          client_id: data.clientId,
          client_name: data.clientName,
          type: data.type,
          start_date: data.startDate,
          end_date: data.endDate || null,
          value: data.value,
          status: data.status,
          attachments: data.attachments ?? [],
          description: data.description ?? null,
          updated_at: new Date().toISOString(),
        }
        const { data: updated, error } = await supabase
          .from('contracts')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapContractRow(updated)
      }
      return apiClient.updateContract(id, data)
    },
    onSuccess: (contract) => {
      updateContract(contract.id, contract)
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

