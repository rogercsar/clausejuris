import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase, hasSupabaseConfig, mapProfileToUser } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { User, UserPlan, UserRole } from '@/types'

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

