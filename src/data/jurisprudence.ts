import type { Jurisprudence, JurisprudenceTimeline } from '@/types'

export const mockJurisprudence: Jurisprudence[] = [
  {
    id: 'jur-001',
    title: 'Responsabilidade Civil por Danos Morais em Acidentes de Trânsito',
    court: 'STJ',
    judge: 'Ministro Luis Felipe Salomão',
    date: '2024-01-15',
    caseNumber: 'REsp 1.234.567/SP',
    summary: 'O STJ consolidou entendimento sobre a responsabilidade civil por danos morais em acidentes de trânsito, estabelecendo que a simples ocorrência do acidente não gera direito automático à indenização por danos morais, sendo necessário demonstrar o efetivo abalo psicológico.',
    fullText: 'Em decisão unânime, o Superior Tribunal de Justiça estabeleceu que a responsabilidade civil por danos morais em acidentes de trânsito deve ser analisada caso a caso, considerando as circunstâncias específicas de cada situação. A corte entendeu que a simples ocorrência do acidente não gera direito automático à indenização por danos morais, sendo necessário demonstrar o efetivo abalo psicológico sofrido pela vítima.',
    keywords: ['responsabilidade civil', 'danos morais', 'acidente de trânsito', 'indenização'],
    relatedLaws: ['art-186-cc', 'art-927-cc', 'art-944-cc'],
    category: 'civil',
    importance: 'high',
    precedentialValue: 'binding',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'jur-002',
    title: 'Trabalho Remoto e Jornada de Trabalho',
    court: 'TST',
    judge: 'Ministro Maurício Godinho Delgado',
    date: '2024-02-20',
    caseNumber: 'RR-123.456/2020',
    summary: 'O TST estabeleceu diretrizes para o trabalho remoto, definindo que o controle de jornada deve ser feito por meio de sistema eletrônico confiável, e que o empregador deve garantir condições adequadas de trabalho.',
    keywords: ['trabalho remoto', 'jornada de trabalho', 'teletrabalho', 'home office'],
    relatedLaws: ['art-75-b-clt', 'art-62-clt'],
    category: 'labor',
    importance: 'high',
    precedentialValue: 'binding',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 'jur-003',
    title: 'Divórcio Consensual e Partilha de Bens',
    court: 'STF',
    judge: 'Ministra Cármen Lúcia',
    date: '2024-03-10',
    caseNumber: 'RE 654.321/DF',
    summary: 'O STF decidiu que no divórcio consensual, a partilha de bens pode ser feita em momento posterior ao divórcio, desde que haja acordo entre as partes sobre a divisão dos bens comuns.',
    keywords: ['divórcio consensual', 'partilha de bens', 'comunhão de bens'],
    relatedLaws: ['art-1570-cc', 'art-1571-cc'],
    category: 'family',
    importance: 'medium',
    precedentialValue: 'binding',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  },
  {
    id: 'jur-004',
    title: 'Responsabilidade do Estado por Omissão',
    court: 'STJ',
    judge: 'Ministro Benedito Gonçalves',
    date: '2024-04-05',
    caseNumber: 'REsp 987.654/RS',
    summary: 'O STJ consolidou entendimento sobre a responsabilidade do Estado por omissão, estabelecendo que é necessário demonstrar a existência de dever legal de agir e a omissão específica do poder público.',
    keywords: ['responsabilidade do estado', 'omissão', 'dever de agir'],
    relatedLaws: ['art-37-cf', 'art-43-cdc'],
    category: 'administrative',
    importance: 'high',
    precedentialValue: 'binding',
    createdAt: '2024-04-05T11:45:00Z',
    updatedAt: '2024-04-05T11:45:00Z'
  },
  {
    id: 'jur-005',
    title: 'Direito do Consumidor e Venda Online',
    court: 'STJ',
    judge: 'Ministra Nancy Andrighi',
    date: '2024-05-12',
    caseNumber: 'REsp 456.789/MG',
    summary: 'O STJ estabeleceu que nas vendas online, o fornecedor deve disponibilizar informações claras sobre o produto, incluindo especificações técnicas, garantia e política de devolução.',
    keywords: ['direito do consumidor', 'venda online', 'e-commerce', 'informação'],
    relatedLaws: ['art-6-cdc', 'art-31-cdc'],
    category: 'consumer',
    importance: 'medium',
    precedentialValue: 'binding',
    createdAt: '2024-05-12T16:20:00Z',
    updatedAt: '2024-05-12T16:20:00Z'
  }
]

export const mockJurisprudenceTimeline: JurisprudenceTimeline[] = [
  {
    id: 'timeline-001',
    jurisprudenceId: 'jur-001',
    eventType: 'decision',
    title: 'Decisão do STJ sobre Danos Morais',
    description: 'O STJ decidiu que danos morais em acidentes de trânsito requerem comprovação de abalo psicológico',
    date: '2024-01-15',
    court: 'STJ',
    metadata: {
      impact: 'high',
      affectedAreas: ['civil', 'insurance']
    }
  },
  {
    id: 'timeline-002',
    jurisprudenceId: 'jur-001',
    eventType: 'precedent_set',
    title: 'Precedente Estabelecido',
    description: 'Esta decisão estabeleceu precedente para casos similares de responsabilidade civil',
    date: '2024-01-20',
    court: 'STJ',
    metadata: {
      precedentValue: 'binding',
      citations: 15
    }
  },
  {
    id: 'timeline-003',
    jurisprudenceId: 'jur-002',
    eventType: 'decision',
    title: 'TST Define Regras para Trabalho Remoto',
    description: 'O TST estabeleceu diretrizes claras para controle de jornada no trabalho remoto',
    date: '2024-02-20',
    court: 'TST',
    metadata: {
      impact: 'high',
      affectedAreas: ['labor', 'hr']
    }
  },
  {
    id: 'timeline-004',
    jurisprudenceId: 'jur-003',
    eventType: 'decision',
    title: 'STF Facilita Divórcio Consensual',
    description: 'O STF permitiu partilha posterior no divórcio consensual',
    date: '2024-03-10',
    court: 'STF',
    metadata: {
      impact: 'medium',
      affectedAreas: ['family']
    }
  },
  {
    id: 'timeline-005',
    jurisprudenceId: 'jur-004',
    eventType: 'law_change',
    title: 'Mudança na Interpretação da Responsabilidade do Estado',
    description: 'Nova interpretação sobre responsabilidade do Estado por omissão',
    date: '2024-04-05',
    court: 'STJ',
    metadata: {
      impact: 'high',
      affectedAreas: ['administrative', 'public']
    }
  }
]

export function searchJurisprudence(query: string, category?: string, court?: string): Jurisprudence[] {
  let results = mockJurisprudence

  if (query) {
    const searchTerm = query.toLowerCase()
    results = results.filter(jurisprudence =>
      jurisprudence.title.toLowerCase().includes(searchTerm) ||
      jurisprudence.summary.toLowerCase().includes(searchTerm) ||
      jurisprudence.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      jurisprudence.caseNumber.toLowerCase().includes(searchTerm)
    )
  }

  if (category) {
    results = results.filter(jurisprudence => jurisprudence.category === category)
  }

  if (court) {
    results = results.filter(jurisprudence => jurisprudence.court.toLowerCase().includes(court.toLowerCase()))
  }

  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getJurisprudenceById(id: string): Jurisprudence | undefined {
  return mockJurisprudence.find(jurisprudence => jurisprudence.id === id)
}

export function getTimelineByJurisprudenceId(jurisprudenceId: string): JurisprudenceTimeline[] {
  return mockJurisprudenceTimeline
    .filter(timeline => timeline.jurisprudenceId === jurisprudenceId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getRelatedJurisprudence(lawId: string): Jurisprudence[] {
  return mockJurisprudence.filter(jurisprudence =>
    jurisprudence.relatedLaws.includes(lawId)
  )
}

export function getRecentJurisprudence(limit: number = 5): Jurisprudence[] {
  return mockJurisprudence
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getJurisprudenceByCategory(category: string): Jurisprudence[] {
  return mockJurisprudence.filter(jurisprudence => jurisprudence.category === category)
}

export function getJurisprudenceStats() {
  const stats = {
    total: mockJurisprudence.length,
    byCategory: {} as Record<string, number>,
    byCourt: {} as Record<string, number>,
    byImportance: {} as Record<string, number>,
    recent: getRecentJurisprudence(3).length
  }

  mockJurisprudence.forEach(jurisprudence => {
    stats.byCategory[jurisprudence.category] = (stats.byCategory[jurisprudence.category] || 0) + 1
    stats.byCourt[jurisprudence.court] = (stats.byCourt[jurisprudence.court] || 0) + 1
    stats.byImportance[jurisprudence.importance] = (stats.byImportance[jurisprudence.importance] || 0) + 1
  })

  return stats
}
