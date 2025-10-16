import { apiClient } from '@/lib/api'
import type { Law as ApiLaw, LawArticle as ApiLawArticle } from '@/types'
import { lawsDatabase, type Law as DataLaw, type LawArticle as DataLawArticle } from '@/data/laws'

export type ProviderKind = 'local' | 'api' | 'lexml'

export interface LawProvider {
  getAllLaws(): Promise<DataLaw[]>
  searchLaws(query: string, filters?: { category?: string; type?: string }): Promise<DataLaw[]>
  searchArticles(query: string, lawId?: string): Promise<DataLawArticle[]>
}

function getCustomLaws(): DataLaw[] {
  try {
    const saved = localStorage.getItem('customLaws')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) return parsed as DataLaw[]
    return []
  } catch {
    return []
  }
}

function mergeLaws(): DataLaw[] {
  const customs = getCustomLaws()
  return [...lawsDatabase, ...customs]
}

function filterAndSearchLaws(all: DataLaw[], query: string, filters?: { category?: string; type?: string }): DataLaw[] {
  let results = all.filter(l => l.isActive)

  if (filters?.category) {
    results = results.filter(l => l.category === filters.category)
  }
  if (filters?.type) {
    results = results.filter(l => l.type === (filters.type as any))
  }

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(law =>
      law.name.toLowerCase().includes(q) ||
      law.shortName.toLowerCase().includes(q) ||
      law.description.toLowerCase().includes(q) ||
      law.articles.some(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.keywords.some(k => k.toLowerCase().includes(q))
      )
    )
  }

  return results
}

function searchArticlesIn(all: DataLaw[], query: string, lawId?: string): DataLawArticle[] {
  let articles: DataLawArticle[] = []
  if (lawId) {
    const law = all.find(l => l.id === lawId)
    if (law) articles = law.articles
  } else {
    all.forEach(l => { articles = articles.concat(l.articles) })
  }
  if (query) {
    const q = query.toLowerCase()
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.keywords.some(k => k.toLowerCase().includes(q))
    )
  }
  return articles
}

// Local provider (dataset + custom via localStorage)
const localProvider: LawProvider = {
  async getAllLaws() {
    return mergeLaws()
  },
  async searchLaws(query: string, filters) {
    const all = mergeLaws()
    return filterAndSearchLaws(all, query, filters)
  },
  async searchArticles(query: string, lawId?: string) {
    const all = mergeLaws()
    return searchArticlesIn(all, query, lawId)
  },
}

// API provider (normaliza retorno da API para o formato rico usado na UI)
const apiProvider: LawProvider = {
  async getAllLaws() {
    const data = await apiClient.getLaws()
    return normalizeApiLaws(data)
  },
  async searchLaws(query: string, filters) {
    // API atual não tem busca/filters no endpoint; traz tudo e filtra no cliente
    const all = await this.getAllLaws()
    return filterAndSearchLaws(all, query, filters)
  },
  async searchArticles(query: string, lawId?: string) {
    const all = await this.getAllLaws()
    return searchArticlesIn(all, query, lawId)
  },
}

// LexML provider (esqueleto; requer endpoint configurado via VITE_LEXML_API_URL)
const lexmlProvider: LawProvider = {
  async getAllLaws() {
    const base = (import.meta.env.VITE_LEXML_API_URL as string | undefined)
    if (!base) return []
    try {
      const res = await fetch(`${base}/laws`)
      if (!res.ok) return []
      const data = await res.json()
      return normalizeApiLaws(data as ApiLaw[])
    } catch {
      return []
    }
  },
  async searchLaws(query: string, filters) {
    const base = (import.meta.env.VITE_LEXML_API_URL as string | undefined)
    if (!base) {
      const all = await this.getAllLaws()
      return filterAndSearchLaws(all, query, filters)
    }
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (filters?.type) params.set('type', filters.type)
      if (filters?.category) params.set('category', filters.category)
      const res = await fetch(`${base}/laws/search?${params.toString()}`)
      if (!res.ok) return []
      const data = await res.json()
      return normalizeApiLaws(data as ApiLaw[])
    } catch {
      return []
    }
  },
  async searchArticles(query: string, lawId?: string) {
    const base = (import.meta.env.VITE_LEXML_API_URL as string | undefined)
    if (!base) {
      const all = await this.getAllLaws()
      return searchArticlesIn(all, query, lawId)
    }
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (lawId) params.set('lawId', lawId)
      const res = await fetch(`${base}/articles/search?${params.toString()}`)
      if (!res.ok) return []
      const data = await res.json()
      // Converte artigos planos para DataLawArticle; se vierem aninhados, normalização básica
      const all = normalizeApiLaws([{ id: 'tmp', name: 'tmp', type: 'tmp', articles: data as any[] } as ApiLaw])
      return searchArticlesIn(all, '', lawId)
    } catch {
      return []
    }
  },
}

function normalizeApiLaws(apiLaws: ApiLaw[]): DataLaw[] {
  const today = new Date().toISOString().split('T')[0]
  return apiLaws.map((l): DataLaw => ({
    id: l.id,
    name: l.name,
    shortName: l.name, // fallback
    type: 'federal', // default até termos metadados
    category: (l.type as any) || 'civil',
    description: '',
    year: new Date().getFullYear(),
    isActive: true,
    lastUpdated: today,
    sourceUrl: (l as any).sourceUrl,
    articles: (l.articles || []).map((a: ApiLawArticle): DataLawArticle => ({
      id: a.id,
      number: a.number,
      title: a.title,
      content: a.content,
      keywords: [],
      relatedArticles: [],
    })),
  }))
}

export function resolveLawProvider(): LawProvider {
  const kind = (import.meta.env.VITE_LAWS_PROVIDER as ProviderKind | undefined) || 'local'
  if (kind === 'lexml') return lexmlProvider
  if (kind === 'api') return apiProvider
  return localProvider
}