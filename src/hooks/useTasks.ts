import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import type { Task, TaskStatus, TaskPriority, TaskType } from '@/types'

function mapTaskRow(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    type: row.type,
    priority: row.priority,
    status: row.status,
    processId: row.process_id ?? undefined,
    contractId: row.contract_id ?? undefined,
    assignedTo: row.assigned_to ?? undefined,
    createdBy: row.created_by,
    dueDate: row.due_date,
    completedAt: row.completed_at ?? undefined,
    reminderDays: Array.isArray(row.reminder_days) ? row.reminder_days : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useTasks(filters?: { 
  status?: TaskStatus
  priority?: TaskPriority
  type?: TaskType
  processId?: string
  contractId?: string
}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      if (hasSupabaseConfig) {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')

        let builder = supabase
          .from('tasks')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })

        if (filters?.status) builder = builder.eq('status', filters.status)
        if (filters?.priority) builder = builder.eq('priority', filters.priority)
        if (filters?.type) builder = builder.eq('type', filters.type)
        if (filters?.processId) builder = builder.eq('process_id', filters.processId)
        if (filters?.contractId) builder = builder.eq('contract_id', filters.contractId)

        const { data, error } = await builder
        if (error) throw error
        return (data ?? []).map(mapTaskRow)
      }
      // Fallback para dados mockados quando Supabase não está configurado
      const { getTasksByStatus, getTasksByPriority, getTasksByProcess, getTasksByContract } = await import('@/data/tasks')
      let tasks = (await import('@/data/tasks')).mockTasks
      if (filters?.status) tasks = getTasksByStatus(filters.status)
      if (filters?.priority) tasks = getTasksByPriority(filters.priority)
      if (filters?.processId) tasks = getTasksByProcess(filters.processId)
      if (filters?.contractId) tasks = getTasksByContract(filters.contractId)
      return tasks
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (hasSupabaseConfig) {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        const uid = authUser.user?.id
        if (!uid) throw new Error('Usuário não autenticado')

        const insertRow: any = {
          user_id: uid,
          title: data.title,
          description: data.description ?? null,
          type: data.type,
          priority: data.priority,
          status: data.status,
          process_id: data.processId ?? null,
          contract_id: data.contractId ?? null,
          assigned_to: data.assignedTo ?? null,
          created_by: data.createdBy,
          due_date: data.dueDate,
          completed_at: data.completedAt ?? null,
          reminder_days: data.reminderDays ?? [],
          tags: data.tags ?? [],
          attachments: data.attachments ?? [],
        }
        const { data: inserted, error } = await supabase
          .from('tasks')
          .insert(insertRow)
          .select('*')
        if (error) throw error
        const row = Array.isArray(inserted) ? inserted[0] : inserted
        return mapTaskRow(row)
      }
      // Fallback para dados mockados
      const { createTask } = await import('@/data/tasks')
      return createTask(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      if (hasSupabaseConfig) {
        const updates: any = {
          title: data.title,
          description: data.description ?? null,
          type: data.type,
          priority: data.priority,
          status: data.status,
          process_id: data.processId ?? null,
          contract_id: data.contractId ?? null,
          assigned_to: data.assignedTo ?? null,
          due_date: data.dueDate,
          completed_at: data.completedAt ?? null,
          reminder_days: data.reminderDays ?? [],
          tags: data.tags ?? [],
          attachments: data.attachments ?? [],
          updated_at: new Date().toISOString(),
        }
        const { data: updated, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return mapTaskRow(updated)
      }
      // Fallback para dados mockados
      const { updateTask } = await import('@/data/tasks')
      return updateTask(id, data) || data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (hasSupabaseConfig) {
        const { data: updated, error } = await supabase
          .from('tasks')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId)
          .select('*')
          .single()
        if (error) throw error
        return mapTaskRow(updated)
      }
      // Fallback para dados mockados
      const { completeTask } = await import('@/data/tasks')
      return completeTask(taskId) || {} as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

