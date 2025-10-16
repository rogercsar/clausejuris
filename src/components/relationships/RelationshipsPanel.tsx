import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Scale, 
  FileText, 
  Calendar, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { pjeApi, type Processo } from '@/services/pjeApiService'
import { formatDate } from '@/lib/utils'


interface RelationshipsPanelProps {
  entityType: 'process' | 'contract' | 'client'
  entityId: string
  entityName: string
}

export function RelationshipsPanel({ entityType, entityId, entityName }: RelationshipsPanelProps) {
  // entityType, entityId, entityName are used for future functionality
  console.log('RelationshipsPanel props:', { entityType, entityId, entityName })
  const { user } = useAuth()
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchUserProcesses = async () => {
    if (!user?.document) {
      setError('Usuário não possui CPF cadastrado')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await pjeApi.getProcessos(1, 50, {
        cpf: user.document,
        'justica-gratuita': { eq: false }
      })
      
      if (response.status === 'ok' && response.result) {
        setProcessos(response.result || [])
        setLastUpdate(new Date())
      } else {
        setError(response.messages?.[0] || 'Erro ao buscar processos')
      }
    } catch (err) {
      console.error('Erro ao buscar processos do usuário:', err)
      setError('Erro de conexão com o PJe')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProcesses()
  }, [user?.document])

  const getStatusIcon = (situacao: string) => {
    const status = situacao.toLowerCase()
    if (status.includes('concluído') || status.includes('arquivado')) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    }
    if (status.includes('suspenso') || status.includes('aguardando')) {
      return <Clock className="w-4 h-4 text-yellow-600" />
    }
    if (status.includes('cancelado') || status.includes('extinto')) {
      return <XCircle className="w-4 h-4 text-red-600" />
    }
    return <Clock className="w-4 h-4 text-blue-600" />
  }

  const getStatusColor = (situacao: string) => {
    const status = situacao.toLowerCase()
    if (status.includes('concluído') || status.includes('arquivado')) {
      return 'bg-green-100 text-green-800 border-green-200'
    }
    if (status.includes('suspenso') || status.includes('aguardando')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    if (status.includes('cancelado') || status.includes('extinto')) {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Relacionamentos PJe
            </CardTitle>
            <CardDescription>
              Processos relacionados ao usuário no sistema PJe
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUserProcesses}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        {lastUpdate && (
          <p className="text-xs text-secondary-500 mt-2">
            Última atualização: {lastUpdate.toLocaleString('pt-BR')}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {loading && processos.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-secondary-400 animate-spin" />
            <p className="text-secondary-600">Carregando processos...</p>
          </div>
        ) : processos.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhum processo encontrado
            </h3>
            <p className="text-secondary-600 mb-4">
              Não foram encontrados processos relacionados ao seu CPF no PJe.
            </p>
            <Button onClick={fetchUserProcesses} variant="outline">
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">
                {processos.length} processo(s) encontrado(s)
              </p>
              <Badge variant="outline" className="text-xs">
                CPF: {user?.document}
              </Badge>
            </div>

            <div className="space-y-3">
              {processos.map((processo) => (
                <div
                  key={processo.id}
                  className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-secondary-900">
                          {processo.numero}
                        </h4>
                        <Badge className={getStatusColor(processo.status || 'pending')}>
                          {getStatusIcon(processo.status || 'pending')}
                          <span className="ml-1">{processo.status || 'Pendente'}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-secondary-700 mb-1">
                        <strong>Classe:</strong> {processo.classe}
                      </p>
                      <p className="text-sm text-secondary-700 mb-1">
                        <strong>Assuntos:</strong> {processo.assuntos.join(', ')}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-600">
                        <strong>Distribuição:</strong> {processo['data-distribuicao'] ? formatDate(processo['data-distribuicao']) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-600">
                        <strong>Tribunal:</strong> {processo.tribunal || 'N/A'}
                      </span>
                    </div>
                    {processo['valor-da-causa'] && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-600">
                          <strong>Valor:</strong> {formatCurrency(processo['valor-da-causa'])}
                        </span>
                      </div>
                    )}
                  </div>

                  {processo.partes && (
                    <div className="mt-3 pt-3 border-t border-secondary-200">
                      <h5 className="text-sm font-medium text-secondary-700 mb-2">Partes:</h5>
                      <div className="text-sm text-secondary-600">
                        {processo.partes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
