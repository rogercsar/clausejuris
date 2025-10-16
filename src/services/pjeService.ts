import type { Process, Contract } from '@/types'

export type PJEUploadResult = {
  success: boolean
  protocol?: string
  message?: string
}

export async function uploadToPJE(_context: Process | Contract, _fileName: string, _content: string): Promise<PJEUploadResult> {
  // Mock request latency
  await new Promise(r => setTimeout(r, 800))
  // Mock success with a random protocol number
  return {
    success: true,
    protocol: `PJE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    message: 'Documento enviado com sucesso ao PJe (simulado).'
  }
}




