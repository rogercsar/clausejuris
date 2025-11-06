import { http, HttpResponse } from 'msw'
import type { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Contract, 
  Process, 
  Client,
  Law,
  EditorSuggestion,
  CrossReference
} from '@/types'

// Mock data
const users: User[] = [
  {
    id: '1',
    email: 'admin@clause.com',
    name: 'Admin',
    fullName: 'Administrador do Sistema',
    oab: '123456',
    phone: '(11) 99999-9999',
    plan: 'pro',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const contracts: Contract[] = [
  {
    id: '1',
    type: 'rental',
    clientId: '1',
    clientName: 'João Silva',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 2500.00,
    status: 'active',
    attachments: ['contrato.pdf'],
    description: 'Contrato de locação residencial',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'service',
    clientId: '2',
    clientName: 'Maria Santos',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    value: 5000.00,
    status: 'active',
    attachments: ['servico.pdf'],
    description: 'Prestação de serviços de consultoria',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
]

const processes: Process[] = [
  {
    id: '1',
    type: 'civil',
    clientId: '1',
    clientName: 'João Silva',
    status: 'in_progress',
    startDate: '2024-01-15',
    attachments: ['processo.pdf'],
    description: 'Ação de cobrança',
    court: '1ª Vara Cível',
    caseNumber: '1234567-89.2024.1.01.0001',
    againstWho: 'Empresa ABC Ltda',
    involved: 'João Silva (Cliente)',
    lawyer: 'Dr. Maria Santos - OAB/SP 123456',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    type: 'labor',
    clientId: '3',
    clientName: 'Pedro Costa',
    status: 'won',
    startDate: '2023-12-01',
    endDate: '2024-03-01',
    attachments: ['trabalhista.pdf'],
    description: 'Ação trabalhista por horas extras',
    court: '1ª Vara do Trabalho',
    caseNumber: '9876543-21.2023.5.02.0001',
    againstWho: 'Tech Solutions Ltda',
    involved: 'Pedro Costa (Cliente)',
    lawyer: 'Dr. Ana Paula - OAB/SP 789012',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
]

const clients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    document: '123.456.789-00',
    type: 'person',
    address: 'Rua A, 123 - São Paulo/SP',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    document: '987.654.321-00',
    type: 'person',
    address: 'Rua B, 456 - São Paulo/SP',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '(11) 99999-3333',
    document: '456.789.123-00',
    type: 'person',
    address: 'Rua C, 789 - São Paulo/SP',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Tech Solutions Ltda',
    email: 'contato@techsolutions.com',
    phone: '(11) 99999-4444',
    document: '12.345.678/0001-90',
    type: 'company',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Consultoria Jurídica ABC',
    email: 'contato@abcjuridico.com',
    phone: '(11) 88888-8888',
    document: '98.765.432/0001-10',
    type: 'company',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '6',
    name: 'Ana Paula Advogada',
    email: 'ana.paula@email.com',
    phone: '(11) 77777-7777',
    document: '111.222.333-44',
    type: 'person',
    address: 'Rua das Palmeiras, 456 - São Paulo/SP',
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
  },
]

const laws: Law[] = [
  {
    id: '1',
    name: 'Código Civil',
    type: 'civil',
    articles: [
      {
        id: '1',
        number: 'Art. 1.723',
        title: 'Contrato de locação',
        content: 'O contrato de locação é o contrato pelo qual uma das partes se obriga a ceder à outra, temporariamente, o uso e gozo de coisa infungível, mediante certa retribuição.',
        lawId: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'CLT',
    type: 'labor',
    articles: [
      {
        id: '2',
        number: 'Art. 7º',
        title: 'Direitos dos trabalhadores',
        content: 'São direitos dos trabalhadores urbanos e rurais, além de outros que visem à melhoria de sua condição social...',
        lawId: '2',
      },
    ],
  },
]

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as RegisterRequest
    const newUser: User = {
      id: Date.now().toString(),
      ...body,
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    
    return HttpResponse.json<AuthResponse>({
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
    })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginRequest
    const user = users.find(u => u.email === body.email)
    
    if (!user || body.password !== '123456') {
      return HttpResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json<AuthResponse>({
      user,
      token: 'mock-jwt-token-' + Date.now(),
    })
  }),

  http.get('/api/me', () => {
    return HttpResponse.json<User>(users[0])
  }),

  http.put('/api/me', async ({ request }) => {
    const body = await request.json() as Partial<User>
    const updatedUser = { ...users[0], ...body, updatedAt: new Date().toISOString() }
    users[0] = updatedUser
    return HttpResponse.json<User>(updatedUser)
  }),

  // Contracts endpoints
  http.get('/api/contracts', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    
    let filteredContracts = contracts
    
    if (status) {
      filteredContracts = filteredContracts.filter(c => c.status === status)
    }
    if (type) {
      filteredContracts = filteredContracts.filter(c => c.type === type)
    }
    
    return HttpResponse.json<Contract[]>(filteredContracts)
  }),

  http.post('/api/contracts', async ({ request }) => {
    const body = await request.json() as Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>
    const newContract: Contract = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    contracts.push(newContract)
    return HttpResponse.json<Contract>(newContract)
  }),

  http.patch('/api/contracts/:id', async ({ request, params }) => {
    const body = await request.json() as Partial<Contract>
    const id = params.id as string
    const index = contracts.findIndex(c => c.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      )
    }
    
    contracts[index] = { ...contracts[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json<Contract>(contracts[index])
  }),

  // Processes endpoints
  http.get('/api/processes', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    
    let filteredProcesses = processes
    
    if (status) {
      filteredProcesses = filteredProcesses.filter(p => p.status === status)
    }
    if (type) {
      filteredProcesses = filteredProcesses.filter(p => p.type === type)
    }
    
    return HttpResponse.json<Process[]>(filteredProcesses)
  }),

  http.post('/api/processes', async ({ request }) => {
    const body = await request.json() as Omit<Process, 'id' | 'createdAt' | 'updatedAt'>
    const newProcess: Process = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    processes.push(newProcess)
    return HttpResponse.json<Process>(newProcess)
  }),

  http.patch('/api/processes/:id', async ({ request, params }) => {
    const body = await request.json() as Partial<Process>
    const id = params.id as string
    const index = processes.findIndex(p => p.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }
    
    processes[index] = { ...processes[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json<Process>(processes[index])
  }),

  // Clients endpoints
  http.get('/api/clients', () => {
    return HttpResponse.json<Client[]>(clients)
  }),

  http.get('/api/clients/:id', ({ params }) => {
    const id = params.id as string
    const client = clients.find(c => c.id === id)
    
    if (!client) {
      return HttpResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json<Client>(client)
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = await request.json() as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
    const newClient: Client = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    clients.push(newClient)
    return HttpResponse.json<Client>(newClient)
  }),

  http.patch('/api/clients/:id', async ({ request, params }) => {
    const body = await request.json() as Partial<Client>
    const id = params.id as string
    const index = clients.findIndex(c => c.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }
    
    clients[index] = { ...clients[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json<Client>(clients[index])
  }),

  // Cross-reference endpoints
  http.get('/api/cross-reference/:entityType/:entityId', ({ params }) => {
    const entityType = params.entityType as string
    const entityId = params.entityId as string
    
    const references: CrossReference[] = []
    
    if (entityType === 'contract') {
      const contract = contracts.find(c => c.id === entityId)
      if (contract) {
        // Find related processes
        const relatedProcesses = processes.filter(p => p.clientId === contract.clientId)
        relatedProcesses.forEach(process => {
          references.push({
            entityId: process.id,
            entityType: 'process',
            entityName: process.description || `Processo ${process.id}`,
            relationType: 'same_client',
            details: `Mesmo cliente: ${contract.clientName}`,
            riskLevel: process.status === 'lost' ? 'high' : 'low',
          })
        })
      }
    } else if (entityType === 'process') {
      const process = processes.find(p => p.id === entityId)
      if (process) {
        // Find related contracts
        const relatedContracts = contracts.filter(c => c.clientId === process.clientId)
        relatedContracts.forEach(contract => {
          references.push({
            entityId: contract.id,
            entityType: 'contract',
            entityName: contract.description || `Contrato ${contract.id}`,
            relationType: 'same_client',
            details: `Mesmo cliente: ${process.clientName}`,
            riskLevel: contract.status === 'terminated' ? 'high' : 'low',
          })
        })
      }
    }
    
    return HttpResponse.json<CrossReference[]>(references)
  }),

  // Laws endpoints
  http.get('/api/laws', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    
    let filteredLaws = laws
    if (type) {
      filteredLaws = laws.filter(l => l.type === type)
    }
    
    return HttpResponse.json<Law[]>(filteredLaws)
  }),

  // Editor suggestions
  http.post('/api/editor/suggest', async ({ request }) => {
    const body = await request.json() as { text: string; context?: string; topics?: string[] }

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

    // Context-aware snippets
    if (body.context?.startsWith('process')) {
      contextual.push({
        id: 'pr-1',
        type: 'snippet',
        text: 'número do processo',
        replacement: '0000000-00.0000.0.00.0000',
        description: 'Inserir número do processo',
        confidence: 0.92,
      })
    } else if (body.context?.startsWith('contract')) {
      contextual.push({
        id: 'ct-1',
        type: 'snippet',
        text: 'valor do contrato',
        replacement: 'R$ 0,00',
        description: 'Inserir valor do contrato',
        confidence: 0.92,
      })
    }

    // Topic-based additions
    const topics = body.topics || []
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

    const suggestions = [...base, ...contextual]
    return HttpResponse.json<EditorSuggestion[]>(suggestions)
  }),

  // Editor draft generation
  http.post('/api/editor/generate-draft', async ({ request }) => {
    const body = await request.json() as { text: string; context?: string; topics?: string[] }

    const title = body.context?.startsWith('contract')
      ? 'Minuta de Contrato'
      : body.context?.startsWith('process')
      ? 'Petição Inicial'
      : 'Documento Jurídico'

    const sections: string[] = []
    // Topics influence sections
    const topics = body.topics || []
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

    // Default essential sections if topics are empty
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

    const preface = body.text?.trim()
      ? `Contexto do usuário: ${body.text.trim().slice(-300)}`
      : 'Minuta gerada automaticamente com base em contexto e tópicos selecionados.'

    const draft = [
      title,
      '',
      preface,
      '',
      ...sections,
      '',
      'Assinaturas: As partes firmam o presente em 2 (duas) vias de igual teor.'
    ].join('\n')

    return HttpResponse.json<{ draft: string }>({ draft })
  }),

  // Payment upgrade
  http.post('/api/payments/upgrade', async ({ request }) => {
    const body = await request.json() as { plan: 'pro' }
    const user = users[0]
    user.plan = body.plan
    user.updatedAt = new Date().toISOString()
    
    return HttpResponse.json({ success: true, user })
  }),

  // Subscription endpoints
  http.post('/api/subscription/create-preference', async ({ request }) => {
    const { plan } = await request.json() as { plan: 'common' | 'pro' };

    if (!plan || (plan !== 'common' && plan !== 'pro')) {
      return HttpResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Mock de uma preferência de pagamento do Mercado Pago
    const preference = {
      id: `pref_${new Date().getTime()}`,
      items: [
        {
          title: `Plano ${plan === 'common' ? 'Comum' : 'Pró'}`,
          quantity: 1,
          unit_price: plan === 'common' ? 30 : 80,
        },
      ],
      payer: {
        email: 'test_user_12345@testuser.com',
      },
      back_urls: {
        success: 'http://localhost:3000/subscription/success',
        failure: 'http://localhost:3000/subscription/failure',
        pending: 'http://localhost:3000/subscription/pending',
      },
      auto_return: 'approved',
      // Este é o URL que o frontend usará para redirecionar o usuário para o checkout
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock_pref_${plan}`,
    };

    return HttpResponse.json(preference);
  }),

  // AI endpoints
  http.post('/api/ai/analyze-document', async ({ request }) => {
    const { documentContent } = await request.json() as { documentContent: string };

    if (!documentContent) {
      return HttpResponse.json({ error: 'Conteúdo do documento é obrigatório' }, { status: 400 });
    }

    // Simula uma análise de IA
    const analysis = {
      summary: 'Este é um resumo gerado por IA do documento fornecido.',
      risks: [
        { level: 'high', description: 'Cláusula de rescisão abusiva.' },
        { level: 'medium', description: 'Prazo de pagamento pouco claro.' },
      ],
      suggestions: [
        'Revisar a cláusula de rescisão para torná-la mais equilibrada.',
        'Especificar as datas de vencimento no prazo de pagamento.',
      ],
    };

    return HttpResponse.json(analysis);
  }),

  http.post('/api/ai/editor-assist', async ({ request }) => {
    const { text, context } = await request.json() as { text: string; context?: string };

    const suggestions = [
      {
        type: 'autocomplete',
        text: 'Conforme o Art. 482 da CLT...',
        description: 'Sugestão de jurisprudência',
      },
      {
        type: 'correction',
        text: 'corrije',
        replacement: 'corrige',
        description: 'Correção ortográfica',
      },
    ];

    return HttpResponse.json({ suggestions });
  }),

  http.post('/api/ai/vademecum-query', async ({ request }) => {
    const { query } = await request.json() as { query: string };

    if (!query) {
      return HttpResponse.json({ error: 'A consulta é obrigatória' }, { status: 400 });
    }

    const results = [
      {
        law: 'Código Civil',
        article: 'Art. 1.723',
        summary: 'Define a união estável como entidade familiar...',
        relevance: 0.95,
      },
      {
        law: 'CLT',
        article: 'Art. 482',
        summary: 'Descreve as hipóteses de justa causa para rescisão do contrato de trabalho.',
        relevance: 0.88,
      },
    ];

    return HttpResponse.json({ results });
  }),
]
