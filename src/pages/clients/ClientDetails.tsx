import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, User, Building, Phone, Mail, MapPin, Calendar, FolderOpen, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClient } from '@/hooks/useClients'
import { formatDate } from '@/lib/utils'
import { listClientFiles } from '@/services/storageService'
import { RelationshipsPanel } from '@/components/relationships/RelationshipsPanel'
import { useState, useEffect } from 'react'

export function ClientDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: client, isLoading, error } = useClient(id!)
  const [clientFiles, setClientFiles] = useState<any[]>([])
  const [filesLoading, setFilesLoading] = useState(false)

  useEffect(() => {
    if (client?.id) {
      setFilesLoading(true)
      try {
        const files = listClientFiles(client.id)
        setClientFiles(files)
      } catch (error) {
        console.error('Erro ao carregar arquivos do cliente:', error)
        setClientFiles([])
      } finally {
        setFilesLoading(false)
      }
    }
  }, [client?.id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-secondary-200 rounded"></div>
            <div className="h-32 bg-secondary-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Cliente não encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              O cliente que você está procurando não existe ou foi removido.
            </p>
            <Link to="/clients">
              <Button>
                Ver todos os clientes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{client.name}</h1>
            <p className="text-secondary-600">
              {client.type === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/editor?clientId=${client.id}`}>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Editor
            </Button>
          </Link>
          <Link to={`/clients/${client.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {client.type === 'company' ? (
                  <Building className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                Informações do Cliente
              </CardTitle>
              <CardDescription>
                Detalhes completos do {client.type === 'company' ? 'fornecedor' : 'cliente'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Nome</label>
                  <p className="text-secondary-900 font-medium">{client.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-600">
                    {client.type === 'company' ? 'CNPJ' : 'CPF'}
                  </label>
                  <p className="text-secondary-900 font-mono">{client.document}</p>
                </div>
                
                {client.email && (
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary-400" />
                      <p className="text-secondary-900">{client.email}</p>
                    </div>
                  </div>
                )}
                
                {client.phone && (
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Telefone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-secondary-400" />
                      <p className="text-secondary-900">{client.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {client.address && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Endereço</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-secondary-400 mt-0.5" />
                    <p className="text-secondary-900">{client.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Tipo</span>
                  <Badge variant="outline">
                    {client.type === 'company' ? 'Empresa' : 'Pessoa'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Status</span>
                  <Badge variant="success">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Folder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Pasta do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Arquivos salvos</span>
                  <Badge variant="outline">
                    {filesLoading ? 'Carregando...' : `${clientFiles.length} arquivos`}
                  </Badge>
                </div>
                <Link to={`/clients/${client.id}/files`}>
                  <Button className="w-full" variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Acessar Pasta
                  </Button>
                </Link>
                {clientFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-secondary-500 mb-2">Últimos arquivos:</p>
                    <div className="space-y-1">
                      {clientFiles.slice(0, 3).map((file) => (
                        <div key={file.id} className="flex items-center gap-2 text-xs text-secondary-600">
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Criado em</label>
                  <p className="text-secondary-900">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Atualizado em</label>
                  <p className="text-secondary-900">{formatDate(client.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relationships Panel */}
          <RelationshipsPanel
            entityType="client"
            entityId={client.id}
            entityName={client.name}
          />
        </div>
      </div>
    </div>
  )
}
