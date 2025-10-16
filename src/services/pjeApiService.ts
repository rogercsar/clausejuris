export interface PJeApiResponse<T = any> {
  status: 'ok' | 'error' | 'in-progress'
  code: string
  messages: string[]
  result: T
  'page-info'?: {
    current: number
    last: number
    size: number
    count: number
  }
}

export interface Processo {
  id: string
  numero: string
  classe: number
  assuntos: number[]
  partes: string
  'valor-da-causa': number
  'segredo-de-justica': boolean
  'justica-gratuita': boolean
  'pedido-de-liminar': boolean
  status?: string
  'data-distribuicao'?: string
  tribunal?: string
  vara?: string
  'partes-cpf'?: string
}

export interface ProcessoFilter {
  'justica-gratuita'?: { eq: boolean }
  'partes-cpf'?: { eq: string }
  'segredo-de-justica'?: { eq: boolean }
  'valor-da-causa'?: { gte?: number; lte?: number }
  status?: { eq: string }
  tribunal?: { eq: string }
  cpf?: string
}

export interface Documento {
  id: string
  nome: string
  tipo: string
  'data-upload': string
  tamanho: number
  'processo-id': string
}

export interface OrgaoJulgador {
  id: string
  nome: string
  ativo: string
}

// Mock data
let processos: Processo[] = [
  {
    id: '1',
    numero: '0001234-56.2018.2.00.0000',
    classe: 10,
    assuntos: [12, 34],
    partes: 'FULANO x CICRANO',
    'valor-da-causa': 34678.90,
    'segredo-de-justica': false,
    'justica-gratuita': false,
    'pedido-de-liminar': false,
    status: 'em_andamento',
    'data-distribuicao': '2018-01-15',
    tribunal: 'TJ-SP',
    vara: '1ª Vara Cível',
    'partes-cpf': '12345678901'
  },
  {
    id: '2',
    numero: '0005678-90.2019.1.01.0001',
    classe: 15,
    assuntos: [45, 67],
    partes: 'EMPRESA ABC x JOÃO SILVA',
    'valor-da-causa': 50000.00,
    'segredo-de-justica': false,
    'justica-gratuita': true,
    'pedido-de-liminar': true,
    status: 'aguardando_audiencia',
    'data-distribuicao': '2019-03-20',
    tribunal: 'TJ-RJ',
    vara: '2ª Vara Cível',
    'partes-cpf': '99977766654'
  },
  {
    id: '3',
    numero: '0009876-54.2020.1.02.0002',
    classe: 20,
    assuntos: [89, 12],
    partes: 'MARIA SILVA x ESTADO',
    'valor-da-causa': 15000.00,
    'segredo-de-justica': false,
    'justica-gratuita': true,
    'pedido-de-liminar': false,
    status: 'em_andamento',
    'data-distribuicao': '2020-05-10',
    tribunal: 'TJ-SP',
    vara: '3ª Vara Cível',
    'partes-cpf': '99977766654'
  }
]

let documentos: Documento[] = [
  {
    id: '1',
    nome: 'Petição Inicial.pdf',
    tipo: 'application/pdf',
    'data-upload': '2024-01-15T10:30:00Z',
    tamanho: 1024000,
    'processo-id': '1'
  },
  {
    id: '2',
    nome: 'Contestação.docx',
    tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'data-upload': '2024-01-20T14:15:00Z',
    tamanho: 512000,
    'processo-id': '1'
  }
]

let orgaosJulgadores: OrgaoJulgador[] = [
  {
    id: '1',
    nome: 'GAB. DESEMB. FULANO DE TAL',
    ativo: 'true'
  },
  {
    id: '2',
    nome: 'GAB. DESEMB. CICRANO DE TAL',
    ativo: 'true'
  }
]

// Utility functions
function createSuccessResponse<T>(result: T, pageInfo?: any): PJeApiResponse<T> {
  return {
    status: 'ok',
    code: '200',
    messages: [],
    result,
    ...(pageInfo && { 'page-info': pageInfo })
  }
}

function createErrorResponse(code: string, messages: string[]): PJeApiResponse {
  return {
    status: 'error',
    code,
    messages,
    result: {}
  }
}

function createInProgressResponse(result: any): PJeApiResponse {
  return {
    status: 'in-progress',
    code: '202',
    messages: [],
    result
  }
}

// API Service
export class PJeApiService {

  constructor(_baseUrl: string = 'https://api.pje.jus.br/v1') {
    // baseUrl is not used in mock implementation
  }

  // GET /processos - Lista todos os processos
  async getProcessos(page: number = 1, size: number = 10, filter?: ProcessoFilter | string): Promise<PJeApiResponse<Processo[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filteredProcessos = [...processos]
      
      // Apply filters
      if (filter) {
        if (typeof filter === 'string') {
          // Parse query string format: "justica-gratuita eq true; partes-cpf eq 99977766654"
          filteredProcessos = this.parseQueryStringFilter(processos, filter)
        } else {
          // Apply JSON filter format
          filteredProcessos = this.applyJsonFilter(processos, filter)
        }
      }
      
      const startIndex = (page - 1) * size
      const endIndex = startIndex + size
      const paginatedProcessos = filteredProcessos.slice(startIndex, endIndex)
      
      const pageInfo = {
        current: page,
        last: Math.ceil(filteredProcessos.length / size),
        size,
        count: filteredProcessos.length
      }

      return createSuccessResponse(paginatedProcessos, pageInfo)
    } catch (error) {
      return createErrorResponse('500', ['Erro interno do servidor'])
    }
  }

  // Parse query string filter format
  private parseQueryStringFilter(processos: Processo[], filterString: string): Processo[] {
    const conditions = filterString.split(';').map(c => c.trim())
    
    return processos.filter(processo => {
      return conditions.every(condition => {
        const [field, operator, value] = condition.split(' ').map(s => s.trim())
        
        switch (field) {
          case 'justica-gratuita':
            return operator === 'eq' && processo['justica-gratuita'] === (value === 'true')
          case 'partes-cpf':
            return operator === 'eq' && processo['partes-cpf'] === value
          case 'segredo-de-justica':
            return operator === 'eq' && processo['segredo-de-justica'] === (value === 'true')
          case 'status':
            return operator === 'eq' && processo.status === value
          case 'tribunal':
            return operator === 'eq' && processo.tribunal === value
          default:
            return true
        }
      })
    })
  }

  // Apply JSON filter format
  private applyJsonFilter(processos: Processo[], filter: ProcessoFilter): Processo[] {
    return processos.filter(processo => {
      // Check justica-gratuita filter
      if (filter['justica-gratuita']?.eq !== undefined) {
        if (processo['justica-gratuita'] !== filter['justica-gratuita'].eq) {
          return false
        }
      }
      
      // Check partes-cpf filter
      if (filter['partes-cpf']?.eq !== undefined) {
        if (processo['partes-cpf'] !== filter['partes-cpf'].eq) {
          return false
        }
      }
      
      // Check segredo-de-justica filter
      if (filter['segredo-de-justica']?.eq !== undefined) {
        if (processo['segredo-de-justica'] !== filter['segredo-de-justica'].eq) {
          return false
        }
      }
      
      // Check status filter
      if (filter.status?.eq !== undefined) {
        if (processo.status !== filter.status.eq) {
          return false
        }
      }
      
      // Check tribunal filter
      if (filter.tribunal?.eq !== undefined) {
        if (processo.tribunal !== filter.tribunal.eq) {
          return false
        }
      }
      
      // Check valor-da-causa range filter
      if (filter['valor-da-causa']) {
        const valor = processo['valor-da-causa']
        if (filter['valor-da-causa'].gte !== undefined && valor < filter['valor-da-causa'].gte!) {
          return false
        }
        if (filter['valor-da-causa'].lte !== undefined && valor > filter['valor-da-causa'].lte!) {
          return false
        }
      }
      
      return true
    })
  }

  // GET /processos/:id - Retorna processo específico
  async getProcesso(id: string): Promise<PJeApiResponse<Processo>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const processo = processos.find(p => p.id === id)
      if (!processo) {
        return createErrorResponse('404', ['Processo não encontrado'])
      }

      return createSuccessResponse(processo)
    } catch (error) {
      return createErrorResponse('500', ['Erro interno do servidor'])
    }
  }

  // POST /processos - Cria um novo processo
  async createProcesso(processo: Omit<Processo, 'id'>): Promise<PJeApiResponse<Processo>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newProcesso: Processo = {
        ...processo,
        id: (processos.length + 1).toString()
      }
      
      processos.push(newProcesso)
      
      return createSuccessResponse(newProcesso)
    } catch (error) {
      return createErrorResponse('500', ['Erro ao criar processo'])
    }
  }

  // PUT /processos/:id - Atualiza processo específico
  async updateProcesso(id: string, updates: Partial<Processo>): Promise<PJeApiResponse<Processo>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const index = processos.findIndex(p => p.id === id)
      if (index === -1) {
        return createErrorResponse('404', ['Processo não encontrado'])
      }

      processos[index] = { ...processos[index], ...updates }
      
      return createSuccessResponse(processos[index])
    } catch (error) {
      return createErrorResponse('500', ['Erro ao atualizar processo'])
    }
  }

  // DELETE /processos/:id - Exclui processo específico
  async deleteProcesso(id: string): Promise<PJeApiResponse<{}>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = processos.findIndex(p => p.id === id)
      if (index === -1) {
        return createErrorResponse('404', ['Processo não encontrado'])
      }

      processos.splice(index, 1)
      
      return createSuccessResponse({})
    } catch (error) {
      return createErrorResponse('500', ['Erro ao excluir processo'])
    }
  }

  // GET /processos/:id/documentos - Lista documentos do processo
  async getProcessoDocumentos(processoId: string): Promise<PJeApiResponse<Documento[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 250))
      
      const processoDocumentos = documentos.filter(d => d['processo-id'] === processoId)
      
      return createSuccessResponse(processoDocumentos)
    } catch (error) {
      return createErrorResponse('500', ['Erro ao buscar documentos'])
    }
  }

  // POST /processos/:id/documentos - Cria documento no processo
  async createProcessoDocumento(processoId: string, documento: Omit<Documento, 'id' | 'processo-id'>): Promise<PJeApiResponse<Documento>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const newDocumento: Documento = {
        ...documento,
        id: (documentos.length + 1).toString(),
        'processo-id': processoId
      }
      
      documentos.push(newDocumento)
      
      return createSuccessResponse(newDocumento)
    } catch (error) {
      return createErrorResponse('500', ['Erro ao criar documento'])
    }
  }

  // GET /orgaos-julgadores - Lista órgãos julgadores
  async getOrgaosJulgadores(): Promise<PJeApiResponse<OrgaoJulgador[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return createSuccessResponse(orgaosJulgadores)
    } catch (error) {
      return createErrorResponse('500', ['Erro ao buscar órgãos julgadores'])
    }
  }

  // GET /processos:cabecalho/:id - Retorna cabeçalho do processo
  async getProcessoCabecalho(id: string): Promise<PJeApiResponse<Processo>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const processo = processos.find(p => p.id === id)
      if (!processo) {
        return createErrorResponse('404', ['Processo não encontrado'])
      }

      return createSuccessResponse(processo)
    } catch (error) {
      return createErrorResponse('500', ['Erro ao buscar cabeçalho do processo'])
    }
  }

  // GET /processos:download/:id - Inicia download assíncrono
  async downloadProcesso(_id: string): Promise<PJeApiResponse<{ link: string }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const protocolo = Math.floor(Math.random() * 1000000000)
      const link = `/processos:download:status/${protocolo}`
      
      return createInProgressResponse({ link })
    } catch (error) {
      return createErrorResponse('500', ['Erro ao iniciar download'])
    }
  }
}

// Export singleton instance
export const pjeApi = new PJeApiService()
