import { pjeApi, type Processo } from './pjeApiService'
import { notificationService } from './notificationService'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'

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

function mapTribunalUpdateRow(row: any): TribunalUpdate {
  return {
    id: row.id,
    processNumber: row.process_number,
    title: row.title,
    description: row.description,
    date: row.update_date || row.created_at,
    status: row.status ?? undefined,
    tribunal: row.tribunal ?? undefined,
    vara: row.vara ?? undefined,
  }
}

export async function loadTribunalUpdates(): Promise<TribunalUpdate[]> {
  if (hasSupabaseConfig) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser.user?.id) return []
      
      const { data, error } = await supabase
        .from('tribunal_updates')
        .select('*')
        .eq('user_id', authUser.user.id)
        .order('update_date', { ascending: false })
        .limit(20)
      
      if (error) {
        console.error('Error loading tribunal updates:', error)
        return []
      }
      
      return (data ?? []).map(mapTribunalUpdateRow)
    } catch (error) {
      console.error('Error loading tribunal updates:', error)
      return []
    }
  }
  return updates
}

export function subscribeTribunalUpdates(cb: (updates: TribunalUpdate[]) => void) {
  listeners.push(cb)
  // Load initial updates
  loadTribunalUpdates().then(loaded => {
    updates = loaded
    cb(updates)
  })
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
export async function startTribunalPolling() {
  if (started) return
  started = true
  
  // Load tracked numbers from Supabase or localStorage
  const numbers = await loadTrackedProcessNumbers()
  numbers.forEach(n => trackedNumbers.add(n))
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
        
        // Save to Supabase if configured
        if (hasSupabaseConfig && newUpdates.length > 0) {
          try {
            const { data: authUser } = await supabase.auth.getUser()
            if (authUser.user?.id) {
              const inserts = newUpdates.map(u => ({
                user_id: authUser.user!.id,
                process_number: u.processNumber,
                title: u.title,
                description: u.description,
                status: u.status ?? null,
                tribunal: u.tribunal ?? null,
                vara: u.vara ?? null,
                update_date: u.date,
              }))
              
              const { error: insertError } = await supabase
                .from('tribunal_updates')
                .insert(inserts)
              
              if (insertError) {
                console.error('Error saving tribunal updates:', insertError)
              }
            }
          } catch (error) {
            console.error('Error saving tribunal updates:', error)
          }
        }
        
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

export async function trackTribunalProcessNumbers(numbers: string[]) {
  numbers.forEach(n => trackedNumbers.add(n))
  
  // Save to Supabase if configured
  if (hasSupabaseConfig) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser.user?.id) {
        // Fallback to localStorage
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('trackedNumbers', JSON.stringify(Array.from(trackedNumbers)))
          }
        } catch { void 0 }
        return
      }
      
      // Get existing tracked numbers
      const { data: existing } = await supabase
        .from('tracked_process_numbers')
        .select('process_number')
        .eq('user_id', authUser.user.id)
      
      const existingNumbers = new Set(existing?.map(r => r.process_number) || [])
      
      // Insert new numbers
      const toInsert = numbers
        .filter(n => !existingNumbers.has(n))
        .map(n => ({
          user_id: authUser.user!.id,
          process_number: n,
        }))
      
      if (toInsert.length > 0) {
        const { error } = await supabase
          .from('tracked_process_numbers')
          .insert(toInsert)
        
        if (error) {
          console.error('Error tracking process numbers:', error)
        }
      }
    } catch (error) {
      console.error('Error tracking process numbers:', error)
    }
  }
  
  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trackedNumbers', JSON.stringify(Array.from(trackedNumbers)))
    }
  } catch { void 0 }
}

export async function loadTrackedProcessNumbers(): Promise<string[]> {
  if (hasSupabaseConfig) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser.user?.id) return []
      
      const { data, error } = await supabase
        .from('tracked_process_numbers')
        .select('process_number')
        .eq('user_id', authUser.user.id)
      
      if (error) {
        console.error('Error loading tracked numbers:', error)
        return []
      }
      
      return (data ?? []).map(r => r.process_number)
    } catch (error) {
      console.error('Error loading tracked numbers:', error)
      return []
    }
  }
  
  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trackedNumbers')
      if (saved) {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr)) return arr
      }
    }
  } catch { void 0 }
  
  return []
}



