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
import { notificationService } from '@/services/notificationService'

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const maxRetries = 2
    const baseDelayMs = 250
    let attempt = 0
    let response: Response | null = null
    let lastError: any = null

    while (attempt <= maxRetries) {
      try {
        response = await fetch(url, {
          ...options,
          headers,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        break
      } catch (err: any) {
        lastError = err
        if (attempt === maxRetries) break
        const jitter = Math.random() * 100
        const delay = baseDelayMs * Math.pow(2, attempt) + jitter
        await new Promise(r => setTimeout(r, delay))
        attempt++
      }
    }

    if (!response) {
      await notificationService.createNotification({
        type: 'custom',
        title: 'Falha de rede',
        message: `Não foi possível conectar-se à API em ${endpoint}`,
        entityId: '',
        entityType: 'contract',
        entityName: 'Sistema',
        priority: 'high',
        metadata: { customData: { endpoint } }
      })
      throw lastError || new Error('Erro na requisição')
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || ''
      let message = 'Erro na requisição'
      try {
        if (contentType.includes('application/json')) {
          const errorBody = await response.json()
          message = errorBody.message || errorBody.error || message
        } else {
          const text = await response.text()
          if (text) message = text
        }
      } catch (_) {
        // ignore parse errors
      }
      await notificationService.createNotification({
        type: 'custom',
        title: 'Erro na API',
        message: message,
        entityId: '',
        entityType: 'contract',
        entityName: 'Sistema',
        priority: 'medium',
        metadata: { customData: { endpoint, status: response.status } }
      })
      throw new Error(message)
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }
    // For non-JSON responses, return as text
    const text = await response.text()
    // @ts-expect-error generic return for non-json
    return text
  }

  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMe(): Promise<User> {
    return this.request<User>('/me')
  }

  async updateMe(data: Partial<User>): Promise<User> {
    return this.request<User>('/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Contracts
  async getContracts(params?: { status?: string; type?: string }): Promise<Contract[]> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.type) searchParams.set('type', params.type)
    
    const query = searchParams.toString()
    return this.request<Contract[]>(`/contracts${query ? `?${query}` : ''}`)
  }

  async createContract(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    return this.request<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    return this.request<Contract>(`/contracts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Processes
  async getProcesses(params?: { status?: string; type?: string }): Promise<Process[]> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.type) searchParams.set('type', params.type)
    
    const query = searchParams.toString()
    return this.request<Process[]>(`/processes${query ? `?${query}` : ''}`)
  }

  async createProcess(data: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>): Promise<Process> {
    return this.request<Process>('/processes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProcess(id: string, data: Partial<Process>): Promise<Process> {
    return this.request<Process>(`/processes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return this.request<Client[]>('/clients')
  }

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    return this.request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getClient(id: string): Promise<Client> {
    return this.request<Client>(`/clients/${id}`)
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    return this.request<Client>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Cross-reference
  async getCrossReferences(entityType: string, entityId: string): Promise<CrossReference[]> {
    return this.request<CrossReference[]>(`/cross-reference/${entityType}/${entityId}`)
  }

  // Laws
  async getLaws(type?: string): Promise<Law[]> {
    const query = type ? `?type=${type}` : ''
    return this.request<Law[]>(`/laws${query}`)
  }

  // Editor
  async getEditorSuggestions(
    data: { text: string; context?: string; topics?: string[] },
    opts?: { signal?: AbortSignal }
  ): Promise<EditorSuggestion[]> {
    return this.request<EditorSuggestion[]>('/editor/suggest', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: opts?.signal,
    })
  }

  async generateDraft(
    data: { text: string; context?: string; topics?: string[] },
    opts?: { signal?: AbortSignal }
  ): Promise<{ draft: string }> {
    return this.request<{ draft: string }>('/editor/generate-draft', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: opts?.signal,
    })
  }

  // Payment
  async upgradePlan(plan: 'pro'): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/payments/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

