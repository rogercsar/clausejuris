import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useContracts } from '@/hooks/useContracts'
import { useContractsStore } from '@/store/contracts'
import { useNotifications } from '@/hooks/useNotifications'
import { 
  formatCurrency, 
  formatDate, 
  getContractTypeLabel, 
  getContractStatusLabel, 
  getStatusColor 
} from '@/lib/utils'
import type { ContractStatus, ContractType } from '@/types'

export function ContractsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContractStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<ContractType | ''>('')
  
  const { setFilters } = useContractsStore()
  const { data: contracts = [], isLoading } = useContracts({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  })
  
  const { checkContractsForNotifications } = useNotifications()

  // Check for notifications when contracts change
  useEffect(() => {
    if (contracts.length > 0) {
      checkContractsForNotifications(contracts)
    }
  }, [contracts, checkContractsForNotifications])

  const filteredContracts = (contracts as any[]).filter((contract: any) => {
    const matchesSearch = contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleFilterChange = (key: 'status' | 'type', value: string) => {
    if (key === 'status') {
      setStatusFilter(value as ContractStatus || '')
      setFilters({ status: value as ContractStatus || undefined })
    } else {
      setTypeFilter(value as ContractType || '')
      setFilters({ type: value as ContractType || undefined })
    }
  }

  const clearFilters = () => {
    setStatusFilter('')
    setTypeFilter('')
    setSearchTerm('')
    setFilters({})
  }

  const statusOptions: { value: ContractStatus; label: string }[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'ended', label: 'Encerrado' },
    { value: 'terminated', label: 'Rescindido' },
  ]

  const typeOptions: { value: ContractType; label: string }[] = [
    { value: 'rental', label: 'Locação' },
    { value: 'service', label: 'Prestação de Serviços' },
    { value: 'purchase_sale', label: 'Compra e Venda' },
    { value: 'partnership', label: 'Sociedade' },
    { value: 'employment', label: 'Trabalhista' },
    { value: 'other', label: 'Outro' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Contratos</h1>
          <p className="text-secondary-600">
            Gerencie todos os seus contratos jurídicos
          </p>
        </div>
        <Link to="/contracts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
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
                placeholder="Buscar contratos..."
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
        </CardContent>
      </Card>

      {/* Contracts List */}
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
        ) : filteredContracts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhum contrato encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || statusFilter || typeFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro contrato'
              }
            </p>
            <Link to="/contracts/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
            </Link>
          </div>
        ) : (
          filteredContracts.map((contract: any) => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{contract.clientName}</CardTitle>
                    <CardDescription>
                      {getContractTypeLabel(contract.type)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contract.status, 'contract')}>
                    {getContractStatusLabel(contract.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {formatCurrency(contract.value)}
                  </div>
                  <div className="flex items-center text-sm text-secondary-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Início: {formatDate(contract.startDate)}
                  </div>
                  {contract.endDate && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fim: {formatDate(contract.endDate)}
                    </div>
                  )}
                </div>

                {contract.description && (
                  <p className="text-sm text-secondary-600 line-clamp-2">
                    {contract.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <div className="flex space-x-2">
                    <Link to={`/contracts/${contract.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/contracts/${contract.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="text-xs text-secondary-500">
                    {contract.attachments.length} anexo(s)
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

