import { useMemo, useState } from 'react'
import { Eye, MoreHorizontal, Shield, Trash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
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
  useAdminToggleUserStatus,
  useAdminUpdateUser,
  useAdminUserStats,
  useAdminUsers,
} from '@/hooks/useAdmin'
import type { User, UserPlan, UserRole } from '@/types'
import { formatDate } from '@/lib/utils'

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

export function AdminUsersPage() {
  const { data: users = [], isLoading, refetch } = useAdminUsers()
  const stats = useAdminUserStats(users)
  const updateUser = useAdminUpdateUser()
  const toggleUserStatus = useAdminToggleUserStatus()
  const deleteUser = useAdminDeleteUser()

  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<UserPlan | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
          <h1 className="text-2xl font-semibold text-secondary-900">Usuários</h1>
          <p className="text-secondary-600">Gerencie planos, perfis e status de toda a plataforma.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          Recarregar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-secondary-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-secondary-600">Plano Pró</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.planCounts.pro || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-secondary-600">Advogados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {(stats.roleCounts.senior_lawyer || 0) + (stats.roleCounts.junior_lawyer || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-secondary-600">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.roleCounts.client || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de usuários</CardTitle>
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
                      Nenhum usuário encontrado.
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
                        {formatDate(user.createdAt)}
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

export default AdminUsersPage

