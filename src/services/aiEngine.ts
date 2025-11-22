import type { EditorSuggestion } from '@/types'
import { resolveLawProvider } from './lawProvider'

type SuggestParams = { text: string; context?: string; topics?: string[] }

export const aiEngine = {
  async getEditorSuggestions({ text, context, topics = [] }: SuggestParams): Promise<EditorSuggestion[]> {
    const base: EditorSuggestion[] = [
      {
        id: '1',
        type: 'autocomplete',
        text: 'contrato de locação',
        replacement: 'contrato de locação conforme art. 1.723 do Código Civil',
        description: 'Sugestão de texto jurídico',
        confidence: 0.9,
      },
      {
        id: '2',
        type: 'correction',
        text: 'contrato',
        replacement: 'contrato',
        description: 'Correção ortográfica',
        confidence: 0.8,
      },
    ]

    const contextual: EditorSuggestion[] = []

    if (context?.startsWith('process')) {
      contextual.push({
        id: 'pr-1',
        type: 'snippet',
        text: 'número do processo',
        replacement: '0000000-00.0000.0.00.0000',
        description: 'Inserir número do processo',
        confidence: 0.92,
      })
    } else if (context?.startsWith('contract')) {
      contextual.push({
        id: 'ct-1',
        type: 'snippet',
        text: 'valor do contrato',
        replacement: 'R$ 0,00',
        description: 'Inserir valor do contrato',
        confidence: 0.92,
      })
    }

    if (topics.includes('prazo')) {
      contextual.push({
        id: 'tp-1',
        type: 'snippet',
        text: 'prazo contratual',
        replacement: 'Prazo de 12 meses, renovável automaticamente por iguais períodos.',
        description: 'Cláusula de prazo contratual',
        confidence: 0.91,
      })
    }
    if (topics.includes('pagamento')) {
      contextual.push({
        id: 'tp-2',
        type: 'snippet',
        text: 'condições de pagamento',
        replacement: 'Pagamento mensal até o dia 10, com multa de 2% por atraso.',
        description: 'Cláusula de pagamento',
        confidence: 0.9,
      })
    }
    if (topics.includes('rescisão')) {
      contextual.push({
        id: 'tp-3',
        type: 'snippet',
        text: 'rescisão',
        replacement: 'Rescisão por qualquer das partes com aviso prévio de 30 dias.',
        description: 'Cláusula de rescisão',
        confidence: 0.9,
      })
    }
    if (topics.includes('jurisprudência')) {
      contextual.push({
        id: 'tp-4',
        type: 'snippet',
        text: 'jurisprudência relevante',
        replacement: 'STJ, REsp 123456/DF, firmando entendimento sobre o tema.',
        description: 'Inserir jurisprudência relevante',
        confidence: 0.88,
      })
    }
    if (topics.includes('modelo')) {
      contextual.push({
        id: 'tp-5',
        type: 'snippet',
        text: 'modelo base',
        replacement: 'Modelo base de contrato com cláusulas essenciais.',
        description: 'Inserir modelo base',
        confidence: 0.87,
      })
    }

    // Pequeno ajuste por palavra-chave no texto para demonstrar uso do parâmetro
    const textLc = (text || '').toLowerCase()
    if (textLc.includes('contrato')) {
      contextual.push({
        id: 'kw-ctr',
        type: 'snippet',
        text: 'cláusula contratual',
        replacement: 'As partes firmam as cláusulas a seguir, observando a legislação aplicável.',
        description: 'Sugestão por palavra-chave: contrato',
        confidence: 0.86,
      })
    }

    const provider = resolveLawProvider()
    const q = (text || '').toLowerCase().replace(/\n+/g, ' ').slice(-300)
    let lawSnippets: EditorSuggestion[] = []
    try {
      const articles = await provider.searchArticles(q)
      lawSnippets = articles.slice(0, 3).map((a, idx) => ({
        id: `law-${a.id || idx}`,
        type: 'snippet',
        text: a.title,
        replacement: `${a.title}: ${a.content}`,
        description: 'Citação sugerida',
        confidence: 0.85,
      }))
    } catch {
      lawSnippets = []
    }
    const suggestions = [...base, ...contextual, ...lawSnippets]
    return suggestions
  },

  async generateDraft({ text, context, topics = [] }: SuggestParams): Promise<{ draft: string }> {
    const title = context?.startsWith('contract')
      ? 'Minuta de Contrato'
      : context?.startsWith('process')
      ? 'Petição Inicial'
      : 'Documento Jurídico'

    const sections: string[] = []

    if (topics.includes('objeto')) {
      sections.push('Cláusula 1 — Objeto: As partes acordam o objeto do presente instrumento, conforme descrito nas condições específicas e anexos, observando a legislação aplicável.')
    }
    if (topics.includes('prazo')) {
      sections.push('Cláusula 2 — Prazo: O prazo de vigência será de 12 (doze) meses, renovável automaticamente por iguais períodos, salvo manifestação em contrário com 30 (trinta) dias de antecedência.')
    }
    if (topics.includes('pagamento')) {
      sections.push('Cláusula 3 — Pagamento: O pagamento será mensal, até o dia 10, mediante boleto bancário, sujeitando-se a multa de 2% (dois por cento) e juros de 1% (um por cento) ao mês em caso de atraso.')
    }
    if (topics.includes('rescisão')) {
      sections.push('Cláusula 4 — Rescisão: Qualquer das partes poderá rescindir o contrato, sem justa causa, mediante aviso prévio de 30 (trinta) dias, respeitadas as condições previstas neste instrumento.')
    }
    if (topics.includes('foro')) {
      sections.push('Cláusula 5 — Foro: Fica eleito o foro da comarca de São Paulo/SP, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir questões oriundas deste contrato.')
    }

    if (sections.length === 0) {
      sections.push(
        'Cláusula 1 — Partes: Identificação das partes contratantes, com dados completos.',
        'Cláusula 2 — Objeto: Descrição detalhada do objeto do contrato.',
        'Cláusula 3 — Vigência: Prazo de início e término.',
        'Cláusula 4 — Valores e Pagamento: Condições financeiras.',
        'Cláusula 5 — Rescisão: Condições e prazos.',
        'Cláusula 6 — Foro: Comarca competente.'
      )
    }

    const preface = text?.trim()
      ? `Contexto do usuário: ${text.trim().slice(-300)}`
      : 'Minuta gerada automaticamente com base em contexto e tópicos selecionados.'

    let citations = ''
    try {
      const provider = resolveLawProvider()
      const q = (text || '').toLowerCase().replace(/\n+/g, ' ').slice(-300)
      const articles = await provider.searchArticles(q)
      const selected = articles.slice(0, 3)
      if (selected.length > 0) {
        citations = ['Referências legais:', '', ...selected.map(a => `- ${a.title}`)].join('\n')
      }
    } catch {
      citations = ''
    }
    const draft = [
      title,
      '',
      preface,
      '',
      ...sections,
      '',
      'Assinaturas: As partes firmam o presente em 2 (duas) vias de igual teor.',
      '',
      citations
    ].join('\n')

    return { draft }
  }
}

export type AiEngine = typeof aiEngine