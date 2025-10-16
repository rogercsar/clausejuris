import { create } from 'zustand'
import type { Contract, ContractStatus, ContractType } from '@/types'

interface ContractsState {
  contracts: Contract[]
  filters: {
    status?: ContractStatus
    type?: ContractType
    search?: string
  }
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (id: string, contract: Partial<Contract>) => void
  setFilters: (filters: Partial<ContractsState['filters']>) => void
  clearFilters: () => void
}

export const useContractsStore = create<ContractsState>((set) => ({
  contracts: [],
  filters: {},
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) => set((state) => ({ 
    contracts: [...state.contracts, contract] 
  })),
  updateContract: (id, contractData) => set((state) => ({
    contracts: state.contracts.map(contract => 
      contract.id === id 
        ? { ...contract, ...contractData, updatedAt: new Date().toISOString() }
        : contract
    )
  })),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: {} }),
}))

