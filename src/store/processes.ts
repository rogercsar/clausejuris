import { create } from 'zustand'
import type { Process, ProcessStatus, ProcessType } from '@/types'

interface ProcessesState {
  processes: Process[]
  filters: {
    status?: ProcessStatus
    type?: ProcessType
    search?: string
  }
  setProcesses: (processes: Process[]) => void
  addProcess: (process: Process) => void
  updateProcess: (id: string, process: Partial<Process>) => void
  setFilters: (filters: Partial<ProcessesState['filters']>) => void
  clearFilters: () => void
}

export const useProcessesStore = create<ProcessesState>((set) => ({
  processes: [],
  filters: {},
  setProcesses: (processes) => set({ processes }),
  addProcess: (process) => set((state) => ({ 
    processes: [...state.processes, process] 
  })),
  updateProcess: (id, processData) => set((state) => ({
    processes: state.processes.map(process => 
      process.id === id 
        ? { ...process, ...processData, updatedAt: new Date().toISOString() }
        : process
    )
  })),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: {} }),
}))

