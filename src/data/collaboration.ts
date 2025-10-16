import type { 
  User as CollaborationUser, 
  Team, 
  TeamMember, 
  Permission, 
  CollaborationSession, 
  Comment, 
  ActivityLog,
  UserRole,
  TeamRole,
  PermissionResource,
  PermissionAction
} from '@/types'

export const mockUsers: CollaborationUser[] = [
  {
    id: 'user-001',
    name: 'Dr. João Silva',
    email: 'joao.silva@escritorio.com',
    role: 'senior_lawyer',
    avatar: '/avatars/joao.jpg',
    isActive: true,
    lastLogin: '2024-12-14T09:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-14T09:30:00Z',
    fullName: 'Dr. João Silva',
    plan: 'pro'
  },
  {
    id: 'user-002',
    name: 'Maria Santos',
    email: 'maria.santos@escritorio.com',
    role: 'junior_lawyer',
    avatar: '/avatars/maria.jpg',
    isActive: true,
    lastLogin: '2024-12-14T08:45:00Z',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-12-14T08:45:00Z',
    fullName: 'Maria Santos',
    plan: 'pro'
  },
  {
    id: 'user-003',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@escritorio.com',
    role: 'intern',
    avatar: '/avatars/carlos.jpg',
    isActive: true,
    lastLogin: '2024-12-14T10:15:00Z',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-12-14T10:15:00Z',
    fullName: 'Carlos Oliveira',
    plan: 'common'
  },
  {
    id: 'user-004',
    name: 'Ana Costa',
    email: 'ana.costa@escritorio.com',
    role: 'assistant',
    avatar: '/avatars/ana.jpg',
    isActive: true,
    lastLogin: '2024-12-14T07:20:00Z',
    createdAt: '2024-04-05T11:45:00Z',
    updatedAt: '2024-12-14T07:20:00Z',
    fullName: 'Ana Costa',
    plan: 'common'
  },
  {
    id: 'user-005',
    name: 'Pedro Lima',
    email: 'pedro.lima@escritorio.com',
    role: 'paralegal',
    avatar: '/avatars/pedro.jpg',
    isActive: true,
    lastLogin: '2024-12-13T16:30:00Z',
    createdAt: '2024-05-12T16:20:00Z',
    updatedAt: '2024-12-13T16:30:00Z',
    fullName: 'Pedro Lima',
    plan: 'common'
  }
]

export const mockPermissions: Permission[] = [
  {
    id: 'perm-001',
    name: 'Visualizar Processos',
    description: 'Permite visualizar informações de processos',
    resource: 'process',
    action: 'read'
  },
  {
    id: 'perm-002',
    name: 'Editar Processos',
    description: 'Permite editar informações de processos',
    resource: 'process',
    action: 'update'
  },
  {
    id: 'perm-003',
    name: 'Criar Processos',
    description: 'Permite criar novos processos',
    resource: 'process',
    action: 'create'
  },
  {
    id: 'perm-004',
    name: 'Visualizar Contratos',
    description: 'Permite visualizar informações de contratos',
    resource: 'contract',
    action: 'read'
  },
  {
    id: 'perm-005',
    name: 'Editar Contratos',
    description: 'Permite editar informações de contratos',
    resource: 'contract',
    action: 'update'
  },
  {
    id: 'perm-006',
    name: 'Gerenciar Tarefas',
    description: 'Permite criar, editar e atribuir tarefas',
    resource: 'task',
    action: 'create'
  },
  {
    id: 'perm-007',
    name: 'Comentar',
    description: 'Permite adicionar comentários em documentos',
    resource: 'document',
    action: 'comment'
  },
  {
    id: 'perm-008',
    name: 'Exportar Documentos',
    description: 'Permite exportar documentos',
    resource: 'document',
    action: 'export'
  }
]

export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Equipe Civil',
    description: 'Equipe especializada em direito civil',
    members: [
      {
        id: 'member-001',
        userId: 'user-001',
        teamId: 'team-001',
        role: 'owner',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-002', 'perm-003', 'perm-004', 'perm-005', 'perm-006', 'perm-007', 'perm-008'].includes(p.id)),
        joinedAt: '2024-01-15T10:00:00Z',
        isActive: true
      },
      {
        id: 'member-002',
        userId: 'user-002',
        teamId: 'team-001',
        role: 'senior',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-002', 'perm-004', 'perm-005', 'perm-006', 'perm-007'].includes(p.id)),
        joinedAt: '2024-02-20T14:30:00Z',
        isActive: true
      },
      {
        id: 'member-003',
        userId: 'user-003',
        teamId: 'team-001',
        role: 'member',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-004', 'perm-007'].includes(p.id)),
        joinedAt: '2024-03-10T09:15:00Z',
        isActive: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-14T09:30:00Z'
  },
  {
    id: 'team-002',
    name: 'Equipe Trabalhista',
    description: 'Equipe especializada em direito do trabalho',
    members: [
      {
        id: 'member-004',
        userId: 'user-001',
        teamId: 'team-002',
        role: 'manager',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-002', 'perm-003', 'perm-006', 'perm-007', 'perm-008'].includes(p.id)),
        joinedAt: '2024-01-15T10:00:00Z',
        isActive: true
      },
      {
        id: 'member-005',
        userId: 'user-004',
        teamId: 'team-002',
        role: 'member',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-007'].includes(p.id)),
        joinedAt: '2024-04-05T11:45:00Z',
        isActive: true
      },
      {
        id: 'member-006',
        userId: 'user-005',
        teamId: 'team-002',
        role: 'member',
        permissions: mockPermissions.filter(p => ['perm-001', 'perm-006', 'perm-007'].includes(p.id)),
        joinedAt: '2024-05-12T16:20:00Z',
        isActive: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-14T09:30:00Z'
  }
]

export const mockCollaborationSessions: CollaborationSession[] = [
  {
    id: 'session-001',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-001',
    userName: 'Dr. João Silva',
    userRole: 'senior_lawyer',
    action: 'editing',
    timestamp: '2024-12-14T10:30:00Z',
    details: {
      section: 'case_details',
      changes: ['client_name', 'case_value']
    }
  },
  {
    id: 'session-002',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-002',
    userName: 'Maria Santos',
    userRole: 'junior_lawyer',
    action: 'viewing',
    timestamp: '2024-12-14T10:25:00Z'
  },
  {
    id: 'session-003',
    entityType: 'contract',
    entityId: 'contract-001',
    userId: 'user-003',
    userName: 'Carlos Oliveira',
    userRole: 'intern',
    action: 'commenting',
    timestamp: '2024-12-14T10:20:00Z',
    details: {
      commentCount: 3
    }
  }
]

export const mockComments: Comment[] = [
  {
    id: 'comment-001',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-001',
    userName: 'Dr. João Silva',
    userRole: 'senior_lawyer',
    content: 'Precisamos revisar a estratégia de defesa antes da audiência.',
    isResolved: false,
    createdAt: '2024-12-14T09:15:00Z',
    updatedAt: '2024-12-14T09:15:00Z'
  },
  {
    id: 'comment-002',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-002',
    userName: 'Maria Santos',
    userRole: 'junior_lawyer',
    content: 'Concordo. Vou preparar um resumo das principais questões.',
    parentId: 'comment-001',
    isResolved: false,
    createdAt: '2024-12-14T09:30:00Z',
    updatedAt: '2024-12-14T09:30:00Z'
  },
  {
    id: 'comment-003',
    entityType: 'contract',
    entityId: 'contract-001',
    userId: 'user-003',
    userName: 'Carlos Oliveira',
    userRole: 'intern',
    content: 'Esta cláusula pode ser interpretada de forma ambígua.',
    isResolved: false,
    createdAt: '2024-12-14T10:00:00Z',
    updatedAt: '2024-12-14T10:00:00Z'
  }
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-001',
    userName: 'Dr. João Silva',
    action: 'updated',
    description: 'Atualizou informações do cliente',
    metadata: {
      fields: ['client_name', 'client_email'],
      oldValues: ['João da Silva', 'joao@email.com'],
      newValues: ['João Silva Santos', 'joao.santos@email.com']
    },
    timestamp: '2024-12-14T10:30:00Z'
  },
  {
    id: 'log-002',
    entityType: 'process',
    entityId: 'process-001',
    userId: 'user-002',
    userName: 'Maria Santos',
    action: 'viewed',
    description: 'Visualizou o processo',
    timestamp: '2024-12-14T10:25:00Z'
  },
  {
    id: 'log-003',
    entityType: 'contract',
    entityId: 'contract-001',
    userId: 'user-003',
    userName: 'Carlos Oliveira',
    action: 'commented',
    description: 'Adicionou comentário sobre cláusula',
    metadata: {
      commentId: 'comment-003'
    },
    timestamp: '2024-12-14T10:00:00Z'
  },
  {
    id: 'log-004',
    entityType: 'task',
    entityId: 'task-001',
    userId: 'user-001',
    userName: 'Dr. João Silva',
    action: 'assigned',
    description: 'Atribuiu tarefa para Maria Santos',
    metadata: {
      assignedTo: 'user-002',
      assignedToName: 'Maria Santos'
    },
    timestamp: '2024-12-14T09:45:00Z'
  }
]

export function getUserById(userId: string): CollaborationUser | undefined {
  return mockUsers.find(user => user.id === userId)
}

export function getUsersByRole(role: UserRole): CollaborationUser[] {
  return mockUsers.filter(user => user.role === role)
}

export function getActiveUsers(): CollaborationUser[] {
  return mockUsers.filter(user => user.isActive)
}

export function getTeamById(teamId: string): Team | undefined {
  return mockTeams.find(team => team.id === teamId)
}

export function getTeamsByUser(userId: string): Team[] {
  return mockTeams.filter(team => 
    team.members.some(member => member.userId === userId && member.isActive)
  )
}

export function getTeamMembers(teamId: string): TeamMember[] {
  const team = getTeamById(teamId)
  return team ? team.members.filter(member => member.isActive) : []
}

export function getUserPermissions(userId: string, resource?: PermissionResource): Permission[] {
  const userTeams = getTeamsByUser(userId)
  const permissions: Permission[] = []
  
  userTeams.forEach(team => {
    const member = team.members.find(m => m.userId === userId)
    if (member) {
      member.permissions.forEach(perm => {
        if (!resource || perm.resource === resource) {
          if (!permissions.find(p => p.id === perm.id)) {
            permissions.push(perm)
          }
        }
      })
    }
  })
  
  return permissions
}

export function hasPermission(userId: string, resource: PermissionResource, action: PermissionAction): boolean {
  const permissions = getUserPermissions(userId, resource)
  return permissions.some(perm => perm.action === action)
}

export function getCollaborationSessions(entityType: 'process' | 'contract', entityId: string): CollaborationSession[] {
  return mockCollaborationSessions.filter(session => 
    session.entityType === entityType && session.entityId === entityId
  )
}

export function getComments(entityType: 'process' | 'contract' | 'document' | 'task', entityId: string): Comment[] {
  return mockComments.filter(comment => 
    comment.entityType === entityType && comment.entityId === entityId
  )
}

export function getActivityLogs(entityType: 'process' | 'contract' | 'document' | 'task' | 'user', entityId: string): ActivityLog[] {
  return mockActivityLogs.filter(log => 
    log.entityType === entityType && log.entityId === entityId
  )
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Comment {
  const newComment: Comment = {
    ...comment,
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockComments.push(newComment)
  return newComment
}

export function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  }
  
  mockActivityLogs.push(newLog)
  return newLog
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrador',
    senior_lawyer: 'Advogado Sênior',
    junior_lawyer: 'Advogado Júnior',
    intern: 'Estagiário',
    assistant: 'Assistente',
    paralegal: 'Paralegal',
    client: 'Cliente'
  }
  return roleNames[role] || role
}

export function getTeamRoleDisplayName(role: TeamRole): string {
  const roleNames: Record<TeamRole, string> = {
    owner: 'Proprietário',
    manager: 'Gerente',
    senior: 'Sênior',
    member: 'Membro',
    viewer: 'Visualizador'
  }
  return roleNames[role] || role
}
