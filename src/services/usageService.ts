import type { User } from '@/types'

const USAGE_NS = 'clause_usage'

function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

type UsageRecord = {
  aiDocs: number
}

function loadUsage(userId: string, key: string): UsageRecord {
  try {
    const raw = localStorage.getItem(`${USAGE_NS}:${userId}:${key}`)
    return raw ? JSON.parse(raw) : { aiDocs: 0 }
  } catch {
    return { aiDocs: 0 }
  }
}

function saveUsage(userId: string, key: string, rec: UsageRecord) {
  localStorage.setItem(`${USAGE_NS}:${userId}:${key}`, JSON.stringify(rec))
}

export function getAiDocsUsed(user: User, date = new Date()): number {
  const rec = loadUsage(user.id, monthKey(date))
  return rec.aiDocs || 0
}

export function incAiDocs(user: User, date = new Date()): void {
  const key = monthKey(date)
  const rec = loadUsage(user.id, key)
  rec.aiDocs = (rec.aiDocs || 0) + 1
  saveUsage(user.id, key, rec)
}