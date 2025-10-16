import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useProcessesStore } from '@/store/processes'
import { apiClient } from '@/lib/api'
import type { Process, ProcessStatus, ProcessType } from '@/types'

export function useProcesses(filters?: { status?: ProcessStatus; type?: ProcessType }) {
  const { setProcesses } = useProcessesStore()

  const query = useQuery({
    queryKey: ['processes', filters],
    queryFn: () => apiClient.getProcesses(filters),
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
    mutationFn: (data: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.createProcess(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Process> }) => 
      apiClient.updateProcess(id, data),
    onSuccess: (process) => {
      updateProcess(process.id, process)
      queryClient.invalidateQueries({ queryKey: ['processes'] })
    },
  })
}

