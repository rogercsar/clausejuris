import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Scale,
  Calendar,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useProcesses } from '@/hooks/useProcesses'
import { useProcessesStore } from '@/store/processes'
import { useNotifications } from '@/hooks/useNotifications'
import { pjeApi } from '@/services/pjeApiService'
import { subscribeTribunalUpdates, startTribunalPolling, trackTribunalProcessNumbers, type TribunalUpdate } from '@/services/tribunalUpdatesService'
import { 
  formatDate, 
  getProcessTypeLabel, 
  getProcessStatusLabel, 
  getStatusColor 
} from '@/lib/utils'
import type { ProcessStatus, ProcessType } from '@/types'

export function ProcessesList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<ProcessType | ''>('')
  const [pjeNumero, setPjeNumero] = useState('')
  const [pjeCpf, setPjeCpf] = useState('')
  const [pjeLoading, setPjeLoading] = useState(false)
  const [pjeResults, setPjeResults] = useState<any[]>([])
  const [updates, setUpdates] = useState<TribunalUpdate[]>([])
  
  const { setFilters } = useProcessesStore()
  const { data: processes = [], isLoading } = useProcesses({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  })
  
  const { checkProcessesForNotifications } = useNotifications()

  // Check for notifications when processes change
  useEffect(() => {
    if (processes.length > 0) {
      checkProcessesForNotifications(processes)
    }
  }, [processes, checkProcessesForNotifications])

  useEffect(() => {
    void startTribunalPolling()
    const unsub = subscribeTribunalUpdates(setUpdates)
    return () => unsub()
  }, [])

  const filteredProcesses = (processes as any[]).filter((process: any) => {
    const matchesSearch = process.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleFilterChange = (key: 'status' | 'type', value: string) => {
    if (key === 'status') {
      setStatusFilter(value as ProcessStatus || '')
      setFilters({ status: value as ProcessStatus || undefined })
    } else {
      setTypeFilter(value as ProcessType || '')
      setFilters({ type: value as ProcessType || undefined })
    }
  }

  const clearFilters = () => {
    setStatusFilter('')
    setTypeFilter('')
    setSearchTerm('')
    setFilters({})
  }

  const doPjeSearch = async () => {
    setPjeLoading(true)
    try {
      let result: any[] = []
      if (pjeNumero.trim()) {
        const { status, result: r } = await pjeApi.searchByNumero(pjeNumero.trim())
        if (status === 'ok') result = r as any[]
      } else if (pjeCpf.trim()) {
        const { status, result: r } = await pjeApi.searchByCpf(pjeCpf.trim())
        if (status === 'ok') result = r as any[]
      }
      setPjeResults(result)
    } catch {
      setPjeResults([])
    } finally {
      setPjeLoading(false)
    }
  }

  const trackNumero = (numero: string) => {
    void trackTribunalProcessNumbers([numero])
  }

  const statusOptions: { value: ProcessStatus; label: string }[] = [
    { value: 'won', label: 'Ganho' },
    { value: 'lost', label: 'Perdido' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'pending', label: 'Pendente' },
  ]

  const typeOptions: { value: ProcessType; label: string }[] = [
    { value: 'civil', label: 'Civil' },
    { value: 'labor', label: 'Trabalhista' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'family', label: 'Família' },
    { value: 'administrative', label: 'Administrativo' },
    { value: 'other', label: 'Outro' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Processos</h1>
          <p className="text-secondary-600">
            Gerencie todos os seus processos jurídicos
          </p>
        </div>
        <Link to="/processes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Buscar processos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os tipos</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Número PJe" value={pjeNumero} onChange={(e) => setPjeNumero(e.target.value)} />
            <Input placeholder="CPF da Parte" value={pjeCpf} onChange={(e) => setPjeCpf(e.target.value)} />
            <Button onClick={doPjeSearch} disabled={pjeLoading}>
              {pjeLoading ? 'Buscando...' : 'Buscar no PJe'}
            </Button>
            <Button variant="outline" onClick={() => { setPjeNumero(''); setPjeCpf(''); setPjeResults([]) }}>Limpar PJe</Button>
          </div>
        </CardContent>
      </Card>

      {/* Processes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProcesses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Scale className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhum processo encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || statusFilter || typeFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro processo'
              }
            </p>
            <Link to="/processes/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Processo
              </Button>
            </Link>
          </div>
        ) : (
          filteredProcesses.map((process: any) => (
            <Card key={process.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{process.clientName}</CardTitle>
                    <CardDescription>
                      {getProcessTypeLabel(process.type)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(process.status, 'process')}>
                    {getProcessStatusLabel(process.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {process.caseNumber && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <FileText className="w-4 h-4 mr-2" />
                      {process.caseNumber}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-secondary-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Início: {formatDate(process.startDate)}
                  </div>
                  {process.endDate && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fim: {formatDate(process.endDate)}
                    </div>
                  )}
                  {process.court && (
                    <div className="text-sm text-secondary-600">
                      {process.court}
                    </div>
                  )}
                </div>

                {process.description && (
                  <p className="text-sm text-secondary-600 line-clamp-2">
                    {process.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <div className="flex space-x-2">
                    <Link to={`/processes/${process.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/processes/${process.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="text-xs text-secondary-500">
                    {process.attachments.length} anexo(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* PJe Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resultados PJe
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pjeResults.length === 0 ? (
            <p className="text-sm text-secondary-600">Nenhum resultado PJe. Informe o número ou CPF e clique em Buscar.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pjeResults.map((p: any) => (
                <div key={p.id} className="p-3 border border-secondary-200 rounded-md bg-white">
                  <div className="text-sm font-medium">{p.numero}</div>
                  <div className="text-xs text-secondary-600">{p.tribunal} • {p.vara}</div>
                  <div className="text-xs text-secondary-600">Status: {p.status}</div>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => trackNumero(p.numero)}>Rastrear atualizações</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tribunal Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Atualizações do Tribunal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-sm text-secondary-600">Sem atualizações recentes.</p>
          ) : (
            <div className="space-y-2">
              {updates.slice(0, 8).map(u => (
                <Link key={u.id} to={`/processes/${u.id}`} className="block">
                  <div className="p-3 border border-secondary-200 rounded-md bg-white hover:bg-gray-50">
                    <div className="text-sm font-medium">{u.processNumber}</div>
                    <div className="text-xs text-secondary-600">{u.title} — {new Date(u.date).toLocaleString('pt-BR')}</div>
                    <div className="text-xs text-secondary-700 mt-1">{u.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

