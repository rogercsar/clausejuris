import { create } from 'zustand'
import type { Process, ProcessStatus, ProcessType } from '@/types'

export interface ProcessTimelineEvent {
  id: string
  date: string
  title: string
  description?: string
  type: 'status' | 'manual'
}

interface ProcessesState {
  processes: Process[]
  filters: {
    status?: ProcessStatus
    type?: ProcessType
    search?: string
  }
  timelineEvents: Record<string, ProcessTimelineEvent[]>
  setProcesses: (processes: Process[]) => void
  addProcess: (process: Process) => void
  updateProcess: (id: string, process: Partial<Process>) => void
  setFilters: (filters: Partial<ProcessesState['filters']>) => void
  clearFilters: () => void
  addTimelineEvent: (processId: string, event: ProcessTimelineEvent) => void
}

export const useProcessesStore = create<ProcessesState>((set) => ({
  processes: [],
  filters: {},
  timelineEvents: {},
  setProcesses: (processes) => set({ processes }),
  addProcess: (process) => set((state) => ({ 
    processes: [...state.processes, process] 
  })),
  updateProcess: (id, processData) => set((state) => {
    const prev = state.processes.find(p => p.id === id)
    const updatedProcesses = state.processes.map(process => 
      process.id === id 
        ? { ...process, ...processData, updatedAt: new Date().toISOString() }
        : process
    )
    let updatedTimeline = state.timelineEvents
    if (prev && processData.status && processData.status !== prev.status) {
      const ev: ProcessTimelineEvent = {
        id: `status-${id}-${Date.now()}`,
        date: new Date().toISOString(),
        title: 'Status atualizado',
        description: processData.status,
        type: 'status',
      }
      const current = state.timelineEvents[id] || []
      updatedTimeline = { ...state.timelineEvents, [id]: [...current, ev] }
    }
    return { processes: updatedProcesses, timelineEvents: updatedTimeline }
  }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: {} }),
  addTimelineEvent: (processId, event) => set((state) => ({
    timelineEvents: {
      ...state.timelineEvents,
      [processId]: [...(state.timelineEvents[processId] || []), event]
    }
  })),
}))

