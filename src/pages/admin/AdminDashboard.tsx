import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, BarChart3, LineChart, RefreshCw, Shield, Star, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAdminPlatformData, useAdminUserStats, useAdminUsers } from '@/hooks/useAdmin'
import { formatCurrency } from '@/lib/utils'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { data: users = [], isLoading, refetch } = useAdminUsers()
  const stats = useAdminUserStats(users)
  const { data: platformData } = useAdminPlatformData()

  const financeStats = useMemo(() => {
    const contracts = platformData?.contracts ?? []
    const totalValue = contracts.reduce((sum, contract) => sum + (contract.value || 0), 0)
    const activeContracts = contracts.filter(contract => contract.status === 'active').length
    const avgTicket = contracts.length ? totalValue / contracts.length : 0
    const revenueByMonthMap: Record<string, number> = {}

    contracts.forEach(contract => {
      if (!contract.startDate) return
      const date = new Date(contract.startDate)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      revenueByMonthMap[key] = (revenueByMonthMap[key] || 0) + (contract.value || 0)
    })

    const revenueByMonth = Object.entries(revenueByMonthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([key, value]) => {
        const [year, month] = key.split('-').map(Number)
        const label = new Date(year, month - 1).toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        })
        return { label, value }
      })

    return { totalValue, activeContracts, avgTicket, revenueByMonth }
  }, [platformData?.contracts])

  const processStats = useMemo(() => {
    const processes = platformData?.processes ?? []
    const statusCounts: Record<string, number> = {}
    processes.forEach(process => {
      statusCounts[process.status] = (statusCounts[process.status] || 0) + 1
    })
    return { total: processes.length, statusCounts }
  }, [platformData?.processes])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Painel Administrativo</h1>
          <p className="text-secondary-600">
            Controle completo dos usuários, finanças, relatórios e funcionalidades da plataforma.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar dados
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-secondary-500">Contas cadastradas no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Planos Pró</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planCounts.pro || 0}</div>
            <p className="text-xs text-secondary-500">Usuários no plano Pró</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Equipe Jurídica</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.roleCounts.senior_lawyer || 0) + (stats.roleCounts.junior_lawyer || 0)}
            </div>
            <p className="text-xs text-secondary-500">Advogados ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Clientes</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roleCounts.client || 0}</div>
            <p className="text-xs text-secondary-500">Contas de clientes conectadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Financeiro</CardTitle>
              <p className="text-sm text-secondary-500">Resumo financeiro consolidado</p>
            </div>
            <Wallet className="w-5 h-5 text-primary-500" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-secondary-500 uppercase">Receita total</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {formatCurrency(financeStats.totalValue || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-500 uppercase">Contratos ativos</p>
                <p className="text-2xl font-semibold text-secondary-900">{financeStats.activeContracts || 0}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500 uppercase">Ticket médio</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {formatCurrency(financeStats.avgTicket || 0)}
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-700">Receita mensal</span>
                <LineChart className="w-4 h-4 text-secondary-400" />
              </div>
              <div className="space-y-2">
                {(financeStats.revenueByMonth ?? []).length === 0 && (
                  <p className="text-sm text-secondary-500">Sem dados suficientes para gerar o histórico.</p>
                )}
                {(financeStats.revenueByMonth ?? []).map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">{item.label}</span>
                    <span className="text-sm font-semibold text-secondary-900">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Relatórios e Processos</CardTitle>
              <p className="text-sm text-secondary-500">Visão consolidada de andamentos</p>
            </div>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(processStats.statusCounts).map(([status, count]) => (
                <div key={status} className="rounded-lg border border-secondary-200 p-3">
                  <p className="text-xs text-secondary-500 uppercase">{status}</p>
                  <p className="text-xl font-semibold text-secondary-900">{count}</p>
                </div>
              ))}
              {processStats.total === 0 && (
                <p className="text-sm text-secondary-500 col-span-3">Sem processos cadastrados para análise.</p>
              )}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xs text-secondary-500 uppercase">Total de processos</p>
                <p className="text-xl font-semibold text-secondary-900">{processStats.total}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/processes')}>
                Ver processos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Gerenciar usuários', description: 'Controle planos, perfis e status da equipe.', link: '/admin/users' },
            { title: 'Financeiro', description: 'Receitas, contratos e indicadores financeiros.', link: '/admin/finance' },
            { title: 'Relatórios', description: 'Acompanhe processos e métricas operacionais.', link: '/admin/reports' },
            { title: 'Base de leis', description: 'Ative/desative e edite a base jurídica.', link: '/admin/laws' },
            { title: 'Funcionalidades', description: 'Configure os recursos disponíveis por plano.', link: '/admin/features' },
          ].map(card => (
            <div key={card.title} className="rounded-lg border border-secondary-200 p-4">
              <h3 className="text-base font-semibold text-secondary-900">{card.title}</h3>
              <p className="text-sm text-secondary-600 mt-1">{card.description}</p>
              <Link
                to={card.link}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-md border border-secondary-300 px-4 text-sm font-medium text-secondary-700 hover:bg-secondary-50"
              >
                Acessar
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

