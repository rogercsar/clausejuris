import { pjeApi, type Processo } from './pjeApiService'

export type TribunalUpdate = {
  id: string
  processNumber: string
  title: string
  description: string
  date: string
  status?: string
  tribunal?: string
  vara?: string
}

let listeners: Array<(updates: TribunalUpdate[]) => void> = []
let updates: TribunalUpdate[] = []

export function subscribeTribunalUpdates(cb: (updates: TribunalUpdate[]) => void) {
  listeners.push(cb)
  cb(updates)
  return () => {
    listeners = listeners.filter(l => l !== cb)
  }
}

function emit() {
  listeners.forEach(l => l(updates))
}

// Convert PJe process to tribunal update
function processToTribunalUpdate(processo: Processo): TribunalUpdate {
  return {
    id: processo.id,
    processNumber: processo.numero,
    title: 'Andamento processual',
    description: `Movimentação registrada no processo ${processo.numero} - ${processo.partes}`,
    date: new Date().toISOString(),
    status: processo.status,
    tribunal: processo.tribunal,
    vara: processo.vara
  }
}

// Polling using PJe API every 15s
let started = false
export function startTribunalPolling() {
  if (started) return
  started = true
  
  setInterval(async () => {
    try {
      // Fetch recent processes from PJe API
      const response = await pjeApi.getProcessos(1, 5)
      
      if (response.status === 'ok' && response.result) {
        const newUpdates = response.result.map(processToTribunalUpdate)
        updates = [...newUpdates, ...updates].slice(0, 20)
        emit()
      }
    } catch (error) {
      console.error('Erro ao buscar atualizações do tribunal:', error)
      // Fallback to mock update if API fails
      const now = new Date().toISOString()
      const newUpdate: TribunalUpdate = {
        id: `${Date.now()}`,
        processNumber: `${Math.floor(100000 + Math.random()*900000)}-${new Date().getFullYear()}.8.26.0100`,
        title: 'Andamento processual',
        description: 'Movimentação registrada no tribunal (simulado).',
        date: now,
      }
      updates = [newUpdate, ...updates].slice(0, 20)
      emit()
    }
  }, 15000)
}



