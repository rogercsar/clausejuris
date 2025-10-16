import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useProcessesStore } from '@/store/processes'
import { apiClient } from '@/lib/api'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import type { Process, ProcessStatus, ProcessType } from '@/types'

function mapProcessRow(row: any): Process {
  return {
    id: row.id,
    type: row.type,
    clientId: row.client_id,
    clientName: row.client_name,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    description: row.description ?? undefined,
    court: row.court ?? undefined,
    caseNumber: row.case_number ?? undefined,
    againstWho: row.against_who ?? undefined,
    involved: row.involved ?? undefined,
    lawyer: row.lawyer ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useProcesses(filters?: { status?: ProcessStatus; type?: ProcessType }) {
  const { setProcesses } = useProcessesStore()

  const query = useQuery({
    queryKey: ['processes', filters],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        let builder = supabase
          .from('processes')
          .select('*')
          .order('created_at', { ascending: false })
        if (filters?.status) builder = builder.eq('status', filters.status)
        if (filters?.type) builder = builder.eq('type', filters.type)
        const { data, error } = await builder
        if (error) throw error
        return (data ?? []).map(mapProcessRow)
      }
      return apiClient.getProcesses(filters)
    },
  })

  useEffect(() => {
    if (query.data) {
      setProcesses(query.data)
    }
  }, [query.data, setProcesses])

  return query
}

export function useCreateProcess() {
  const { addProcess } = useProcessesStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => {
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
          status: data.status,
          start_date: data.startDate,
          end_date: data.endDate ?? null,
          attachments: data.attachments ?? [],
          description: data.description ?? null,
          court: data.court ?? null,
          case_number: data.caseNumber ?? null,
          against_who: data.againstWho ?? null,
          involved: data.involved ?? null,
          lawyer: data.lawyer ?? null,
        }
        const { data: inserted, error } = await supabase
          .from('processes')
          .insert(insertRow)
          .select('*')
        if (error) throw error
        const row = Array.isArray(inserted) ? inserted[0] : inserted
        return mapProcessRow(row)
      }
      return apiClient.createProcess(data)
    },
    onSuccess: (process) => {
      addProcess(process)
      queryClient.invalidateQueries({ queryKey: ['processes'] })
    },
  })
}

export function useUpdateProcess() {
  const { updateProcess } = useProcessesStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Process> }) => {
      if (hasSupabaseConfig) {
        const updates: any = {
          client_id: data.clientId,
          client_name: data.clientName,
          type: data.type,
          status: data.status,
          start_date: data.startDate,
          end_date: data.endDate ?? null,
          attachments: data.attachments ?? [],
          description: data.description ?? null,
          court: data.court ?? null,
          case_number: data.caseNumber ?? null,
          against_who: data.againstWho ?? null,
          involved: data.involved ?? null,
          lawyer: data.lawyer ?? null,
          updated_at: new Date().toISOString(),
        }
        const { data: updated, error } = await supabase
          .from('processes')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapProcessRow(updated)
      }
      return apiClient.updateProcess(id, data)
    },
    onSuccess: (process) => {
      updateProcess(process.id, process)
      queryClient.invalidateQueries({ queryKey: ['processes'] })
    },
  })
}

