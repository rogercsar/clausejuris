import { Link } from 'react-router-dom'
import { 
  FileText, 
  Scale, 
  Users, 
  Building,
  Edit3, 
  TrendingUp, 
  AlertTriangle,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useContracts } from '@/hooks/useContracts'
import { useProcesses } from '@/hooks/useProcesses'
import { formatCurrency, formatDate, getContractStatusLabel, getProcessStatusLabel, getStatusColor } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { subscribeTribunalUpdates, startTribunalPolling, type TribunalUpdate } from '@/services/tribunalUpdatesService'
import { pjeApi, type Processo, type ProcessoFilter } from '@/services/pjeApiService'
import { Input } from '@/components/ui/Input'
import { Search, X } from 'lucide-react'

export function Dashboard() {
  const [tribunalUpdates, setTribunalUpdates] = useState<TribunalUpdate[]>([])
  const [searchResults, setSearchResults] = useState<Processo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchCpf, setSearchCpf] = useState('')
  const [showJusticaGratuita, setShowJusticaGratuita] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  const { user } = useAuth()
  const { data: contracts = [] } = useContracts()
  const { data: processes = [] } = useProcesses()

  const activeContracts = (contracts as any[]).filter((c: any) => c.status === 'active')
  const activeProcesses = (processes as any[]).filter((p: any) => p.status === 'in_progress')
  const wonProcesses = (processes as any[]).filter((p: any) => p.status === 'won')
  const lostProcesses = (processes as any[]).filter((p: any) => p.status === 'lost')

  const recentContracts = (contracts as any[]).slice(0, 5)
  const recentProcesses = (processes as any[]).slice(0, 5)

  const stats = [
    {
      title: 'Contratos Ativos',
      value: activeContracts.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Processos em Andamento',
      value: activeProcesses.length,
      icon: Scale,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Processos Ganhos',
      value: wonProcesses.length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Processos Perdidos',
      value: lostProcesses.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  useEffect(() => {
    void startTribunalPolling()
    const unsub = subscribeTribunalUpdates(setTribunalUpdates)
    return () => unsub()
  }, [])

  // Auto-load processes for logged user CPF
  useEffect(() => {
    if (user?.document) {
      setSearchCpf(user.document)
      handleAutoSearch(user.document)
    }
  }, [user?.document])

  const handleAutoSearch = async (cpf: string) => {
    setIsSearching(true)
    try {
      const filter: ProcessoFilter = {
        'partes-cpf': { eq: cpf }
      }
      
      const response = await pjeApi.getProcessos(1, 10, filter)
      
      if (response.status === 'ok') {
        setSearchResults(response.result)
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Erro ao carregar processos automaticamente:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchProcesses = async () => {
    if (!searchCpf.trim()) return
    
    setIsSearching(true)
    try {
      const filter: ProcessoFilter = {
        'partes-cpf': { eq: searchCpf.trim() }
      }
      
      if (showJusticaGratuita) {
        filter['justica-gratuita'] = { eq: true }
      }
      
      const response = await pjeApi.getProcessos(1, 20, filter)
      
      if (response.status === 'ok') {
        setSearchResults(response.result)
        setShowSearchResults(true)
      } else {
        console.error('Erro na busca:', response.messages)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Erro ao buscar processos:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchCpf('')
    setShowJusticaGratuita(false)
    setSearchResults([])
    setShowSearchResults(false)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Gerencie seus contratos e processos jurídicos de forma eficiente
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {user?.plan === 'pro' ? 'Plano Pró' : 'Plano Comum'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Process Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Busca de Processos PJe
          </CardTitle>
          <CardDescription>
            Busque processos por CPF e filtros específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Digite o CPF (ex: 99977766654)"
                  value={searchCpf}
                  onChange={(e) => setSearchCpf(e.target.value)}
                  className="w-full"
                />
                {user?.document && (
                  <p className="text-xs text-blue-600 mt-1">
                    Carregando automaticamente processos do seu CPF: {user.document}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleSearchProcesses}
                disabled={!searchCpf.trim() || isSearching}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
              {showSearchResults && (
                <Button variant="outline" onClick={handleClearSearch}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="justica-gratuita"
                checked={showJusticaGratuita}
                onChange={(e) => setShowJusticaGratuita(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="justica-gratuita" className="text-sm text-gray-700">
                Apenas processos com justiça gratuita
              </label>
            </div>
            
            {showSearchResults && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Resultados da Busca ({searchResults.length} processos encontrados)
                </h4>
                <div className="space-y-3">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum processo encontrado com os filtros aplicados</p>
                    </div>
                  ) : (
                    searchResults.map((processo) => (
                      <div key={processo.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-gray-900">{processo.numero}</h5>
                              {processo['justica-gratuita'] && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Justiça Gratuita
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{processo.partes}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Valor: R$ {processo['valor-da-causa'].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              <span>Tribunal: {processo.tribunal}</span>
                              <span>Vara: {processo.vara}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              CPF: {processo['partes-cpf']}
                            </div>
                            {processo.status && (
                              <Badge className="mt-1 text-xs">
                                {processo.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/contracts/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="w-6 h-6" />
                <span>Novo Contrato</span>
              </Button>
            </Link>
            <Link to="/processes/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Scale className="w-6 h-6" />
                <span>Novo Processo</span>
              </Button>
            </Link>
            <Link to="/clients/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="w-6 h-6" />
                <span>Novo Cliente</span>
              </Button>
            </Link>
            <Link to="/suppliers/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Building className="w-6 h-6" />
                <span>Novo Fornecedor</span>
              </Button>
            </Link>
            <Link to="/editor">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Edit3 className="w-6 h-6" />
                <span>Editor Jurídico</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Contratos Recentes</CardTitle>
              <CardDescription>
                Últimos contratos cadastrados
              </CardDescription>
            </div>
            <Link to="/contracts">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                  <p>Nenhum contrato cadastrado</p>
                  <Link to="/contracts/new">
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar primeiro contrato
                    </Button>
                  </Link>
                </div>
              ) : (
                recentContracts.map((contract: any) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        {contract.clientName}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {formatCurrency(contract.value)} • {formatDate(contract.startDate)}
                      </p>
                    </div>
                    <Badge
                      className={getStatusColor(contract.status, 'contract')}
                    >
                      {getContractStatusLabel(contract.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Processes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>
                Últimos processos cadastrados
              </CardDescription>
            </div>
            <Link to="/processes">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProcesses.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <Scale className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                  <p>Nenhum processo cadastrado</p>
                  <Link to="/processes/new">
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar primeiro processo
                    </Button>
                  </Link>
                </div>
              ) : (
                recentProcesses.map((process: any) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        {process.clientName}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {process.caseNumber || 'Sem número'} • {formatDate(process.startDate)}
                      </p>
                    </div>
                    <Badge
                      className={getStatusColor(process.status, 'process')}
                    >
                      {getProcessStatusLabel(process.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tribunal Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Atualizações dos Tribunais</CardTitle>
              <CardDescription>
                Andamentos recentes vinculados ao seu usuário
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tribunalUpdates.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <Scale className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                  <p>Nenhuma atualização recebida ainda</p>
                </div>
              ) : (
                tribunalUpdates.slice(0, 8).map((u) => (
                  <div key={u.id} className="p-3 border border-secondary-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-secondary-900">{u.title}</div>
                      <div className="text-xs text-secondary-500">{formatDate(u.date)}</div>
                    </div>
                    <div className="text-sm text-secondary-700">{u.description}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-secondary-500">Processo: {u.processNumber}</div>
                      {u.tribunal && (
                        <div className="text-xs text-blue-600 font-medium">{u.tribunal}</div>
                      )}
                    </div>
                    {u.vara && (
                      <div className="text-xs text-secondary-400 mt-1">Vara: {u.vara}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
