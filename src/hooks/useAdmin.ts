import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase, hasSupabaseConfig, mapProfileToUser } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { useContractsStore } from '@/store/contracts'
import { useProcessesStore } from '@/store/processes'
import type { User, UserPlan, UserRole, Contract, Process } from '@/types'

function mapMockUserToUser(user: any): User {
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.name,
    fullName: user.fullName ?? user.name,
    phone: user.phone ?? undefined,
    oab: user.oab ?? undefined,
    plan: (user.plan ?? 'common') as UserPlan,
    avatar: user.avatar ?? undefined,
    role: user.role as UserRole | undefined,
    isActive: user.isActive ?? true,
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  }
}

function mapContractRow(row: any): Contract {
  return {
    id: row.id,
    type: row.type,
    clientId: row.client_id,
    clientName: row.client_name,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    value: Number(row.value ?? 0),
    status: row.status,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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

export function useAdminUsers() {
  const isAdmin = useAuthStore(state => state.user?.role === 'admin')

  return useQuery({
    queryKey: ['admin-users'],
    enabled: isAdmin,
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []).map(mapProfileToUser)
      }

      const { mockUsers } = await import('@/data/collaboration')
      return mockUsers.map(mapMockUserToUser)
    },
  })
}

type UpdateUserPayload = {
  id: string
  data: Partial<Pick<User, 'plan' | 'role' | 'name' | 'fullName' | 'phone'>>
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserPayload) => {
      if (hasSupabaseConfig) {
        const updates: Record<string, any> = {
          plan: data.plan ?? undefined,
          role: data.role ?? undefined,
          name: data.name ?? undefined,
          full_name: data.fullName ?? undefined,
          phone: data.phone ?? undefined,
          updated_at: new Date().toISOString(),
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapProfileToUser(profile)
      }

      const { mockUsers } = await import('@/data/collaboration')
      const current = mockUsers.find(user => user.id === id)
      return current ? mapMockUserToUser({ ...current, ...data }) : null
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        const { user, updateUser } = useAuthStore.getState()
        if (user?.id === updatedUser.id) {
          updateUser(updatedUser)
        }
      }
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useAdminUserStats(users: User[]) {
  return useMemo(() => {
    const total = users.length
    const planCounts: Record<UserPlan, number> = {
      common: 0,
      start: 0,
      pro: 0,
      office: 0,
    }
    const roleCounts: Partial<Record<UserRole, number>> = {}

    users.forEach(user => {
      planCounts[user.plan] = (planCounts[user.plan] || 0) + 1
      if (user.role) {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1
      }
    })

    return {
      total,
      planCounts,
      roleCounts,
    }
  }, [users])
}

type ToggleUserStatusPayload = {
  id: string
  isActive: boolean
}

export function useAdminToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: ToggleUserStatusPayload) => {
      if (hasSupabaseConfig) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .update({
            is_active: isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapProfileToUser(profile)
      }

      const { mockUsers } = await import('@/data/collaboration')
      const current = mockUsers.find(user => user.id === id)
      return current ? mapMockUserToUser({ ...current, isActive }) : null
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        const { user, updateUser } = useAuthStore.getState()
        if (user?.id === updatedUser.id) {
          updateUser(updatedUser)
        }
      }
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (hasSupabaseConfig) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id)
        if (error) throw error
        return id
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

type PlatformData = {
  contracts: Contract[]
  processes: Process[]
}

export function useAdminPlatformData() {
  const isAdmin = useAuthStore(state => state.user?.role === 'admin')

  return useQuery({
    queryKey: ['admin-platform-data'],
    enabled: isAdmin,
    queryFn: async (): Promise<PlatformData> => {
      if (hasSupabaseConfig) {
        const [contractsRes, processesRes] = await Promise.all([
          supabase.from('contracts').select('*'),
          supabase.from('processes').select('*'),
        ])

        if (contractsRes.error) throw contractsRes.error
        if (processesRes.error) throw processesRes.error

        return {
          contracts: (contractsRes.data ?? []).map(mapContractRow),
          processes: (processesRes.data ?? []).map(mapProcessRow),
        }
      }

      return {
        contracts: useContractsStore.getState().contracts ?? [],
        processes: useProcessesStore.getState().processes ?? [],
      }
    },
  })
}

