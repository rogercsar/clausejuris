import { useMemo, useState } from 'react'
import { Users, Shield, Star, Activity, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAdminUpdateUser, useAdminUserStats, useAdminUsers } from '@/hooks/useAdmin'
import type { User, UserPlan, UserRole } from '@/types'
import { getPlanLimits } from '@/services/plans'

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

export function AdminDashboard() {
  const { data: users = [], isLoading, refetch } = useAdminUsers()
  const stats = useAdminUserStats(users)
  const updateUser = useAdminUpdateUser()

  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<UserPlan | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

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

  const handlePlanChange = (userId: string, plan: UserPlan) => {
    updateUser.mutate({ id: userId, data: { plan } })
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUser.mutate({ id: userId, data: { role } })
  }

  const plansForMatrix: UserPlan[] = ['common', 'start', 'pro', 'office']

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Painel Administrativo</h1>
          <p className="text-secondary-600">
            Gerencie usuários, planos e funcionalidades disponíveis no sistema.
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
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-secondary-500">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-secondary-500">
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
                          disabled={updateUser.isPending}
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
                          disabled={updateUser.isPending}
                        >
                          {Object.entries(roleLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={user.plan === 'pro' ? 'success' : 'secondary'}>
                          {user.plan === 'pro' ? 'Plano Pró' : `Plano ${planLabels[user.plan]}`}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades por Plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-secondary-600">
            Visualize rapidamente quais recursos estão habilitados para cada plano e garanta que os
            usuários estão com as permissões corretas.
          </p>
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
                {[
                  { key: 'ai', label: 'Recursos de IA' },
                  { key: 'advancedEditor', label: 'Editor avançado' },
                  { key: 'smartTemplates', label: 'Modelos inteligentes' },
                  { key: 'teams', label: 'Gestão de equipes' },
                  { key: 'permissions', label: 'Permissões avançadas' },
                  { key: 'workflow', label: 'Automação de fluxo' },
                  { key: 'sharedFolders', label: 'Pastas compartilhadas' },
                ].map(feature => (
                  <tr key={feature.key}>
                    <td className="px-4 py-3 text-sm font-medium text-secondary-700">
                      {feature.label}
                    </td>
                    {plansForMatrix.map(plan => {
                      const limits = getPlanLimits(plan)
                      const enabled = limits.features[feature.key as keyof typeof limits.features]
                      return (
                        <td key={plan} className="px-4 py-3 text-center">
                          {enabled ? (
                            <Badge variant="success">Habilitado</Badge>
                          ) : (
                            <Badge variant="secondary">Indisponível</Badge>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

