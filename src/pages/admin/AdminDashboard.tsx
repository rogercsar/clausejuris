import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Eye,
  LineChart,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Star,
  Trash,
  Users,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import {
  useAdminDeleteUser,
  useAdminPlatformData,
  useAdminToggleUserStatus,
  useAdminUpdateUser,
  useAdminUserStats,
  useAdminUsers,
} from '@/hooks/useAdmin'
import type { User, UserPlan, UserRole } from '@/types'
import { getPlanLimits } from '@/services/plans'
import { lawsDatabase, type Law } from '@/data/laws'
import { formatCurrency, formatDate } from '@/lib/utils'

const planLabels: Record<UserPlan, string> = {
  common: 'Comum',
  start: 'Start',
  pro: 'Pró',
  office: 'Office',
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  senior_lawyer: 'Adv. Sênior',
  junior_lawyer: 'Adv. Júnior',
  intern: 'Estagiário',
  assistant: 'Assistente',
  paralegal: 'Paralegal',
  client: 'Cliente',
}

const featureDefinitions = [
  { key: 'ai', label: 'Recursos de IA' },
  { key: 'advancedEditor', label: 'Editor avançado' },
  { key: 'smartTemplates', label: 'Modelos inteligentes' },
  { key: 'teams', label: 'Gestão de equipes' },
  { key: 'permissions', label: 'Permissões avançadas' },
  { key: 'workflow', label: 'Automação de fluxo' },
  { key: 'sharedFolders', label: 'Pastas compartilhadas' },
] as const

type FeatureKey = (typeof featureDefinitions)[number]['key']

const plansForMatrix: UserPlan[] = ['common', 'start', 'pro', 'office']

export function AdminDashboard() {
  const navigate = useNavigate()
  const { data: users = [], isLoading, refetch } = useAdminUsers()
  const stats = useAdminUserStats(users)
  const updateUser = useAdminUpdateUser()
  const toggleUserStatus = useAdminToggleUserStatus()
  const deleteUser = useAdminDeleteUser()
  const { data: platformData } = useAdminPlatformData()

  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<UserPlan | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [lawSearch, setLawSearch] = useState('')
  const [laws, setLaws] = useState<Law[]>(lawsDatabase)
  const [featuresByPlan, setFeaturesByPlan] = useState<Record<UserPlan, Record<FeatureKey, boolean>>>(() => {
    return plansForMatrix.reduce((acc, plan) => {
      acc[plan] = { ...getPlanLimits(plan).features }
      return acc
    }, {} as Record<UserPlan, Record<FeatureKey, boolean>>)
  })

  const filteredUsers = useMemo(() => {
    return (users as User[]).filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlan = planFilter === 'all' || user.plan === planFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesPlan && matchesRole
    })
  }, [users, searchTerm, planFilter, roleFilter])

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
        return {
          label: new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          value,
        }
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

  const filteredLaws = useMemo(() => {
    return laws.filter(law =>
      law.name.toLowerCase().includes(lawSearch.toLowerCase()) ||
      law.shortName.toLowerCase().includes(lawSearch.toLowerCase())
    )
  }, [laws, lawSearch])

  const handlePlanChange = (userId: string, plan: UserPlan) => {
    updateUser.mutate({ id: userId, data: { plan } })
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUser.mutate({ id: userId, data: { role } })
  }

  const handleToggleFeature = (plan: UserPlan, featureKey: FeatureKey) => {
    setFeaturesByPlan(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [featureKey]: !prev[plan][featureKey],
      },
    }))
  }

  const handleToggleLaw = (lawId: string) => {
    setLaws(prev =>
      prev.map(law => (law.id === lawId ? { ...law, isActive: !law.isActive } : law))
    )
  }

  const handleDeleteLaw = (lawId: string) => {
    if (window.confirm('Deseja realmente remover essa lei da base?')) {
      setLaws(prev => prev.filter(law => law.id !== lawId))
    }
  }

  const handleViewLaw = (law: Law) => {
    navigate(`/laws?law=${law.id}`)
  }

  const handleToggleUserActive = (user: User) => {
    toggleUserStatus.mutate({ id: user.id, isActive: !user.isActive })
  }

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Excluir o usuário ${user.name}? Esta ação é irreversível.`)) {
      deleteUser.mutate(user.id)
    }
  }

  const isMutationLoading = updateUser.isPending || toggleUserStatus.isPending || deleteUser.isPending

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
          <CardTitle>Gerenciamento de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Buscar por nome ou e-mail"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="rounded-lg border border-secondary-300 px-3 py-2 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value as UserPlan | 'all')}
            >
              <option value="all">Todos os planos</option>
              {Object.entries(planLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  Plano {label}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-secondary-300 px-3 py-2 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
            >
              <option value="all">Todos os perfis</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Usuário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Plano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Perfil
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-secondary-500">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-secondary-500">
                      Nenhum usuário encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-secondary-900">{user.name}</span>
                          <span className="text-sm text-secondary-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          className="rounded-md border border-secondary-300 bg-secondary-50 px-2 py-1 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={user.plan}
                          onChange={e => handlePlanChange(user.id, e.target.value as UserPlan)}
                          disabled={isMutationLoading}
                        >
                          {Object.entries(planLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          className="rounded-md border border-secondary-300 bg-secondary-50 px-2 py-1 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={user.role ?? 'client'}
                          onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={isMutationLoading}
                        >
                          {Object.entries(roleLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={user.isActive === false ? 'secondary' : 'success'}>
                          {user.isActive === false ? 'Inativo' : 'Ativo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="justify-end">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserActive(user)}>
                              <Shield className="w-4 h-4 mr-2" />
                              {user.isActive === false ? 'Ativar usuário' : 'Desativar usuário'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                              <Trash className="w-4 h-4 mr-2 text-red-500" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Leis e Conteúdo</CardTitle>
              <p className="text-sm text-secondary-500">Controle sobre a base jurídica utilizada no editor.</p>
            </div>
            <Button size="sm" onClick={() => alert('Funcionalidade de cadastro de leis será implementada em breve!')}>
              + Adicionar lei
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Buscar por nome, sigla ou categoria"
              value={lawSearch}
              onChange={e => setLawSearch(e.target.value)}
            />
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {filteredLaws.length === 0 && (
                <p className="text-sm text-secondary-500">Nenhuma lei encontrada com os filtros atuais.</p>
              )}
              {filteredLaws.map(law => (
                <div key={law.id} className="rounded-lg border border-secondary-200 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-secondary-900">{law.name}</p>
                      <p className="text-sm text-secondary-500">{law.shortName} • {law.category}</p>
                      <Badge variant={law.isActive ? 'success' : 'secondary'} className="mt-2">
                        {law.isActive ? 'Ativa' : 'Desativada'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleLaw(law.id)}>
                        {law.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert('Edição de leis estará disponível em breve!')}>
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLaw(law)}>
                        Abrir
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteLaw(law.id)}>
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades por plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                      Funcionalidade
                    </th>
                    {plansForMatrix.map(plan => (
                      <th
                        key={plan}
                        className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-secondary-500"
                      >
                        Plano {planLabels[plan]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 bg-white">
                  {featureDefinitions.map(feature => (
                    <tr key={feature.key}>
                      <td className="px-4 py-3 text-sm font-medium text-secondary-700">{feature.label}</td>
                      {plansForMatrix.map(plan => (
                        <td key={plan} className="px-4 py-3 text-center">
                          <Button
                            variant={featuresByPlan[plan][feature.key] ? 'secondary' : 'outline'}
                            size="sm"
                            className="w-full justify-center text-xs"
                            onClick={() => handleToggleFeature(plan, feature.key)}
                          >
                            {featuresByPlan[plan][feature.key] ? 'Habilitado' : 'Indisponível'}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do usuário</DialogTitle>
              <DialogDescription>Informações completas para auditoria e suporte.</DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-xs uppercase text-secondary-500">Nome</p>
                <p className="text-sm font-medium text-secondary-900">{selectedUser.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-secondary-500">Plano</p>
                  <p className="text-sm text-secondary-900">Plano {planLabels[selectedUser.plan]}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-secondary-500">Perfil</p>
                  <p className="text-sm text-secondary-900">{roleLabels[selectedUser.role ?? 'client']}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-secondary-500">Cadastro</p>
                <p className="text-sm text-secondary-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-secondary-500">Status</p>
                <Badge variant={selectedUser.isActive === false ? 'secondary' : 'success'}>
                  {selectedUser.isActive === false ? 'Inativo' : 'Ativo'}
                </Badge>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default AdminDashboard

