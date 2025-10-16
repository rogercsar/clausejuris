import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import { supabase, hasSupabaseConfig, mapProfileToUser } from '@/lib/supabase'
import type { LoginRequest, RegisterRequest, User } from '@/types'

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore()
  
  // Set token in API client when it changes
  React.useEffect(() => {
    apiClient.setToken(token)
  }, [token])

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }
}

export function useLogin() {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      // Prefer Supabase when configured
      if (hasSupabaseConfig) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error

        const userId = authData.user?.id
        const token = authData.session?.access_token ?? ''

        // Load profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (profileError) throw profileError

        return {
          user: mapProfileToUser(profile),
          token,
        }
      }

      try {
        // Try API first
        return await apiClient.login(data)
      } catch (error) {
        // Fallback for demo purposes
        if (data.email === 'admin@clause.com' && data.password === '123456') {
          const mockUser: User = {
            id: '1',
            email: 'admin@clause.com',
            name: 'Admin',
            fullName: 'Administrador do Sistema',
            oab: '123456',
            phone: '(11) 99999-9999',
            plan: 'pro',
            avatar: '',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          }
          return {
            user: mockUser,
            token: 'demo-token-' + Date.now()
          }
        }
        throw error
      }
    },
    onSuccess: (response) => {
      login(response.user, response.token)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useRegister() {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      if (hasSupabaseConfig) {
        // Sign up user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { name: data.name },
          },
        })
        if (signUpError) throw signUpError

        const userId = signUpData.user?.id

        // Create profile row
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          email: data.email,
          name: data.name,
          full_name: data.fullName,
          oab: data.oab ?? null,
          phone: data.phone ?? null,
          plan: data.plan ?? 'common',
        })
        if (insertError) throw insertError

        // Auto sign-in to get session
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (loginError) throw loginError

        const token = authData.session?.access_token ?? ''
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        return { user: mapProfileToUser(profile), token }
      }
      return apiClient.register(data)
    },
    onSuccess: (response) => {
      login(response.user, response.token)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useMe() {
  const { isAuthenticated, user } = useAuthStore()

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data: userData, error } = await supabase.auth.getUser()
        if (error) throw error
        const uid = userData.user?.id
        if (!uid) throw new Error('Usuário não autenticado')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single()
        if (profileError) throw profileError
        return mapProfileToUser(profile)
      }
      try {
        return await apiClient.getMe()
      } catch (error) {
        if (user) {
          return user
        }
        throw error
      }
    },
    enabled: isAuthenticated,
  })
}

export function useUpdateProfile() {
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (hasSupabaseConfig) {
        const { data: authUser } = await supabase.auth.getUser()
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')
        const updates: any = {
          name: data.name,
          full_name: data.fullName,
          oab: data.oab ?? null,
          phone: data.phone ?? null,
          avatar: data.avatar ?? null,
          document: data.document ?? null,
          updated_at: new Date().toISOString(),
        }
        const { data: profile, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', uid)
          .select('*')
          .single()
        if (error) throw error
        return mapProfileToUser(profile)
      }
      return apiClient.updateMe(data)
    },
    onSuccess: (user) => {
      updateUser(user)
      queryClient.setQueryData(['me'], user)
    },
  })
}

export function useUpgradePlan() {
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (_plan: 'pro') => {
      if (hasSupabaseConfig) {
        const { data: authUser } = await supabase.auth.getUser()
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')
        const { data: profile, error } = await supabase
          .from('profiles')
          .update({ plan: 'pro', updated_at: new Date().toISOString() })
          .eq('id', uid)
          .select('*')
          .single()
        if (error) throw error
        return { success: true, user: mapProfileToUser(profile) }
      }
      return apiClient.upgradePlan('pro')
    },
    onSuccess: (response) => {
      updateUser(response.user)
      queryClient.setQueryData(['me'], response.user)
    },
  })
}
