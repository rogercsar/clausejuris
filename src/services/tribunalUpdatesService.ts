import { pjeApi, type Processo } from './pjeApiService'
import { notificationService } from './notificationService'

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
const trackedNumbers = new Set<string>()
let intervalMs = 15000
const emittedIds = new Set<string>()

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
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('trackedNumbers') : null
    if (saved) {
      const arr = JSON.parse(saved)
      if (Array.isArray(arr)) arr.forEach((n: string) => trackedNumbers.add(n))
    }
  } catch { void 0 }
  const tick = async () => {
    try {
      let response
      if (trackedNumbers.size > 0) {
        const all: Processo[] = []
        for (const num of Array.from(trackedNumbers)) {
          const r = await pjeApi.searchByNumero(num)
          if (r.status === 'ok' && Array.isArray(r.result)) all.push(...r.result)
        }
        response = { status: 'ok', result: all } as any
      } else {
        response = await pjeApi.getProcessos(1, 5)
      }
      if (response.status === 'ok' && response.result) {
        const newUpdatesRaw = (response.result as Processo[]).map(processToTribunalUpdate)
        const newUpdates = newUpdatesRaw.filter((u: TribunalUpdate) => {
          if (emittedIds.has(u.id)) return false
          emittedIds.add(u.id)
          return true
        })
        updates = [...newUpdates, ...updates].slice(0, 20)
        if (newUpdates.length > 0) {
          const first = newUpdates[0]
          notificationService.createNotification({
            type: 'custom',
            title: 'Atualização de Tribunal',
            message: first.description,
            entityId: first.id,
            entityType: 'process',
            entityName: first.processNumber,
            priority: 'medium',
          })
        }
        emit()
        intervalMs = 15000
      }
    } catch {
      intervalMs = Math.min(intervalMs * 2, 120000)
    } finally {
      setTimeout(tick, intervalMs)
    }
  }
  setTimeout(tick, intervalMs)
}

export function trackTribunalProcessNumbers(numbers: string[]) {
  numbers.forEach(n => trackedNumbers.add(n))
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trackedNumbers', JSON.stringify(Array.from(trackedNumbers)))
    }
  } catch { void 0 }
}



