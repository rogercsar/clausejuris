import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Building, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClient } from '@/hooks/useClients'
import { formatDate } from '@/lib/utils'

export function SupplierDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: supplier, isLoading, error } = useClient(id!)

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

  if (error || !supplier) {
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
            <Building className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Fornecedor não encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              O fornecedor que você está procurando não existe ou foi removido.
            </p>
            <Link to="/suppliers">
              <Button>
                Ver todos os fornecedores
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
            <h1 className="text-2xl font-bold text-secondary-900">{supplier.name}</h1>
            <p className="text-secondary-600">Fornecedor</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/suppliers/${supplier.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações do Fornecedor
              </CardTitle>
              <CardDescription>
                Detalhes completos do fornecedor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Razão Social</label>
                  <p className="text-secondary-900 font-medium">{supplier.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-600">CNPJ</label>
                  <p className="text-secondary-900 font-mono">{supplier.document}</p>
                </div>
                
                {supplier.email && (
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary-400" />
                      <p className="text-secondary-900">{supplier.email}</p>
                    </div>
                  </div>
                )}
                
                {supplier.phone && (
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Telefone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-secondary-400" />
                      <p className="text-secondary-900">{supplier.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {supplier.address && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Endereço</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-secondary-400 mt-0.5" />
                    <p className="text-secondary-900">{supplier.address}</p>
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
                  <Badge variant="outline">Fornecedor</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Status</span>
                  <Badge variant="success">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Avaliação</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-secondary-900">5.0</span>
                  </div>
                </div>
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
                  <p className="text-secondary-900">{formatDate(supplier.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Atualizado em</label>
                  <p className="text-secondary-900">{formatDate(supplier.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
