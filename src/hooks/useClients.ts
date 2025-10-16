import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import type { Client } from '@/types'

function mapClientRow(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    document: row.document,
    type: row.type,
    address: row.address ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []).map(mapClientRow)
      }
      return apiClient.getClients()
    },
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        return mapClientRow(data)
      }
      return apiClient.getClient(id)
    },
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (hasSupabaseConfig) {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')

        const insertRow: any = {
          user_id: uid,
          name: data.name,
          email: data.email ?? null,
          phone: data.phone ?? null,
          document: data.document,
          type: data.type,
          address: data.address ?? null,
        }
        const { data: inserted, error } = await supabase
          .from('clients')
          .insert(insertRow)
          .select('*')
        if (error) throw error
        // Supabase returns array when not using .single() with insert
        const row = Array.isArray(inserted) ? inserted[0] : inserted
        return mapClientRow(row)
      }
      return apiClient.createClient(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Client> }) => {
      if (hasSupabaseConfig) {
        const updates: any = {
          name: data.name,
          email: data.email ?? null,
          phone: data.phone ?? null,
          document: data.document,
          type: data.type,
          address: data.address ?? null,
          updated_at: new Date().toISOString(),
        }
        const { data: updated, error } = await supabase
          .from('clients')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapClientRow(updated)
      }
      return apiClient.updateClient(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

