import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useContractsStore } from '@/store/contracts'
import { apiClient } from '@/lib/api'
import type { Contract, ContractStatus, ContractType } from '@/types'

export function useContracts(filters?: { status?: ContractStatus; type?: ContractType }) {
  const { setContracts } = useContractsStore()

  const query = useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => apiClient.getContracts(filters),
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
    mutationFn: (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.createContract(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) => 
      apiClient.updateContract(id, data),
    onSuccess: (contract) => {
      updateContract(contract.id, contract)
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

