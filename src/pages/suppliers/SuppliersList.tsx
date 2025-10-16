import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Building,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClients } from '@/hooks/useClients'
import { formatDate } from '@/lib/utils'

export function SuppliersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  
  const { data: clients = [], isLoading } = useClients()

  // Filtrar apenas fornecedores (pessoas jurídicas)
  const suppliers = clients.filter(client => client.type === 'company')
  
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.document.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const clearFilters = () => {
    setCategoryFilter('')
    setSearchTerm('')
  }

  const categories = [
    'Tecnologia',
    'Consultoria',
    'Serviços Jurídicos',
    'Contabilidade',
    'Marketing',
    'Outros'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Fornecedores</h1>
          <p className="text-secondary-600">
            Gerencie todos os seus fornecedores e parceiros
          </p>
        </div>
        <Link to="/suppliers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total</p>
                <p className="text-2xl font-bold text-secondary-900">{suppliers.length}</p>
              </div>
              <Building className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{suppliers.length}</p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Categorias</p>
                <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Novos</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
              </div>
              <Plus className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
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
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhum fornecedor encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || categoryFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro fornecedor'
              }
            </p>
            <Link to="/suppliers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Fornecedor
              </Button>
            </Link>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>
                        Fornecedor
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="success">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <span className="font-medium mr-2">CNPJ:</span>
                    {supplier.document}
                  </div>
                  
                  {supplier.email && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {supplier.email}
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {supplier.phone}
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <div className="flex space-x-2">
                    <Link to={`/suppliers/${supplier.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/suppliers/${supplier.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="text-xs text-secondary-500">
                    Criado em {formatDate(supplier.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

