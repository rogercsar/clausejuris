import { useMemo } from 'react'
import { FileText, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAdminPlatformData } from '@/hooks/useAdmin'
import { formatCurrency, formatDate } from '@/lib/utils'

export function AdminFinancePage() {
  const { data, isLoading, refetch } = useAdminPlatformData()
  const contracts = data?.contracts ?? []

  const metrics = useMemo(() => {
    const totalValue = contracts.reduce((sum, contract) => sum + (contract.value || 0), 0)
    const activeContracts = contracts.filter(contract => contract.status === 'active').length
    const upcoming = contracts
      .filter(contract => contract.endDate)
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
      .slice(0, 5)
    const topClientsMap: Record<string, { clientName: string; total: number; count: number }> = {}
    contracts.forEach(contract => {
      const entry = topClientsMap[contract.clientId] ?? { clientName: contract.clientName, total: 0, count: 0 }
      entry.total += contract.value || 0
      entry.count += 1
      topClientsMap[contract.clientId] = entry
    })
    const topClients = Object.values(topClientsMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    return { totalValue, activeContracts, upcoming, topClients }
  }, [contracts])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Financeiro</h1>
          <p className="text-secondary-600">Acompanhe receitas, contratos e clientes estratégicos.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          Atualizar dados
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Receita total</CardTitle>
            <Wallet className="w-4 h-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">
              {formatCurrency(metrics.totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Contratos ativos</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">
              {metrics.activeContracts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Top clientes</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">
              {(metrics.topClients?.[0]?.clientName) ?? '—'}
            </div>
            <p className="text-xs text-secondary-500">
              {metrics.topClients.length > 0
                ? `${metrics.topClients.length} principais clientes listados abaixo`
                : 'Sem dados suficientes'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proximas renovações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.upcoming.length === 0 && (
              <p className="text-sm text-secondary-500">Nenhum contrato próximo do vencimento.</p>
            )}
            {metrics.upcoming.map(contract => (
              <div key={contract.id} className="rounded-lg border border-secondary-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">{contract.clientName}</p>
                    <p className="text-xs text-secondary-500">{contract.description || contract.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">
                      {formatCurrency(contract.value || 0)}
                    </p>
                    <p className="text-xs text-secondary-500">vence em {formatDate(contract.endDate!)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes estratégicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.topClients.length === 0 && (
              <p className="text-sm text-secondary-500">Sem histórico suficiente para ranking.</p>
            )}
            {metrics.topClients.map(client => (
              <div key={client.clientName} className="rounded-lg border border-secondary-200 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-900">{client.clientName}</p>
                  <p className="text-xs text-secondary-500">{client.count} contrato(s)</p>
                </div>
                <span className="text-sm font-semibold text-secondary-900">
                  {formatCurrency(client.total)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminFinancePage

