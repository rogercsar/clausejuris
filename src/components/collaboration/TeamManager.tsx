import { useState } from 'react'
import { Users, UserPlus, Settings, Crown, Shield, Eye, UserCheck, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { 
  mockTeams,
  mockUsers,
  getRoleDisplayName,
  getTeamRoleDisplayName
} from '@/data/collaboration'
import type { Team, UserRole, TeamRole } from '@/types'

interface TeamManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function TeamManagerModal({ isOpen, onClose }: TeamManagerProps) {
  const [teams] = useState<Team[]>(mockTeams)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  // const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />
      case 'senior':
        return <UserCheck className="w-4 h-4 text-green-600" />
      case 'member':
        return <UserIcon className="w-4 h-4 text-gray-600" />
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-400" />
      default:
        return <UserIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'senior':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'member':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'viewer':
        return 'bg-gray-100 text-gray-400 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserRoleColor = (role: UserRole) => {
    switch (role) {
      case 'senior_lawyer':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'junior_lawyer':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'intern':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'assistant':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'paralegal':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // const getAvailableUsers = (teamId: string) => {
  //   const team = getTeamById(teamId)
  //   if (!team) return []
  //   
  //   const memberUserIds = team.members.map(member => member.userId)
  //   return mockUsers.filter(user => 
  //     user.isActive && !memberUserIds.includes(user.id)
  //   )
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gerenciador de Equipes
          </DialogTitle>
          <DialogDescription>
            Gerencie equipes, membros e permissões do escritório
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Pesquisar equipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nova Equipe
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teams List */}
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Equipes</h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {filteredTeams.map((team) => (
                  <Card 
                    key={team.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTeam?.id === team.id ? 'ring-2 ring-primary-500' : 'hover:bg-secondary-50'
                    }`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          {team.description && (
                            <p className="text-sm text-secondary-600 mt-1">{team.description}</p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {team.members.length} membros
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-xs text-secondary-500">
                        <span>Criada em {formatDate(team.createdAt)}</span>
                        <span>•</span>
                        <span>Atualizada em {formatDate(team.updatedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">
                  {selectedTeam?.name || 'Selecione uma equipe'}
                </h3>
                {selectedTeam && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Membro
                    </Button>
                  </div>
                )}
              </div>

              {selectedTeam ? (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Informações da Equipe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Nome:</span> {selectedTeam?.name}
                        </div>
                        {selectedTeam?.description && (
                          <div>
                            <span className="font-medium">Descrição:</span> {selectedTeam.description}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Membros:</span> {selectedTeam?.members.length}
                        </div>
                        <div>
                          <span className="font-medium">Criada em:</span> {formatDate(selectedTeam?.createdAt || '')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Membros da Equipe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedTeam?.members.map((member: any) => {
                          const user = mockUsers.find(u => u.id === member.userId)
                          if (!user) return null

                          return (
                            <div key={member.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <UserIcon className="w-4 h-4 text-primary-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{user.name}</div>
                                  <div className="text-xs text-secondary-600">{user.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getRoleColor(member.role)}>
                                  {getRoleIcon(member.role)}
                                  <span className="ml-1">{getTeamRoleDisplayName(member.role)}</span>
                                </Badge>
                                <Badge className={getUserRoleColor(user.role || 'senior_lawyer')}>
                                  {getRoleDisplayName(user.role || 'senior_lawyer')}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Permissões da Equipe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedTeam?.members[0]?.permissions.map((permission: any) => (
                          <div key={permission.id} className="flex items-center justify-between p-2 border border-secondary-200 rounded">
                            <div>
                              <div className="font-medium text-sm">{permission.name}</div>
                              <div className="text-xs text-secondary-600">{permission.description}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {permission.resource}.{permission.action}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Selecione uma equipe para ver os detalhes</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
