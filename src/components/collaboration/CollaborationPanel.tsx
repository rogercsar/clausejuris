import { useState, useEffect } from 'react'
import { MessageSquare, Users, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { 
  getComments,
  getCollaborationSessions,
  getActivityLogs,
  addComment,
  addActivityLog,
  getRoleDisplayName
} from '@/data/collaboration'
import type { Comment, CollaborationSession, ActivityLog, User } from '@/types'

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
  entityType: 'process' | 'contract'
  entityId: string
  entityName: string
}

export function CollaborationPanel({ isOpen, onClose, entityType, entityId, entityName }: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'collaborators'>('comments')
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [sessions, setSessions] = useState<CollaborationSession[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [currentUser] = useState<User>({
    id: 'user-001',
    name: 'Dr. João Silva',
    email: 'joao.silva@escritorio.com',
    role: 'senior_lawyer',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-14T09:30:00Z',
    fullName: 'Dr. João Silva',
    plan: 'pro'
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, entityType, entityId])

  const loadData = () => {
    setComments(getComments(entityType, entityId))
    setSessions(getCollaborationSessions(entityType, entityId))
    setActivityLogs(getActivityLogs(entityType, entityId))
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = addComment({
      entityType,
      entityId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role || 'senior_lawyer',
      content: newComment.trim(),
      isResolved: false
    })

    setComments(prev => [comment, ...prev])
    setNewComment('')

    // Add activity log
    addActivityLog({
      entityType,
      entityId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'commented',
      description: 'Adicionou um comentário',
      metadata: { commentId: comment.id }
    })
  }

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isResolved: true, updatedAt: new Date().toISOString() }
        : comment
    ))
  }

  const getRoleColor = (role: string) => {
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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'editing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'viewing':
        return <Users className="w-4 h-4 text-green-500" />
      case 'commenting':
        return <MessageSquare className="w-4 h-4 text-orange-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleString('pt-BR')
  // }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Colaboração - {entityName}
          </DialogTitle>
          <DialogDescription>
            Comentários, atividades e colaboradores em tempo real
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-secondary-200">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('comments')}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Comentários ({comments.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Atividades ({activityLogs.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'collaborators' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('collaborators')}
            >
              <Users className="w-4 h-4 mr-1" />
              Colaboradores ({sessions.length})
            </button>
          </div>

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Adicionar comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                    </div>
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {comments.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Nenhum comentário ainda</p>
                    </CardContent>
                  </Card>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className={comment.isResolved ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-secondary-600">
                              {comment.userName.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <Badge className={getRoleColor(comment.userRole)}>
                                {getRoleDisplayName(comment.userRole)}
                              </Badge>
                              <span className="text-xs text-secondary-500">
                                {getRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-900 mb-3">{comment.content}</p>
                            <div className="flex items-center gap-2">
                              {!comment.isResolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResolveComment(comment.id)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Resolver
                                </Button>
                              )}
                              {comment.isResolved && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Resolvido
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {activityLogs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Nenhuma atividade registrada</p>
                  </CardContent>
                </Card>
              ) : (
                activityLogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-secondary-600">
                            {log.userName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{log.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                            <span className="text-xs text-secondary-500">
                              {getRelativeTime(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-900">{log.description}</p>
                          {log.metadata && (
                            <div className="mt-2 text-xs text-secondary-600">
                              {JSON.stringify(log.metadata, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Collaborators Tab */}
          {activeTab === 'collaborators' && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Nenhum colaborador ativo</p>
                  </CardContent>
                </Card>
              ) : (
                sessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-secondary-600">
                            {session.userName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{session.userName}</span>
                            <Badge className={getRoleColor(session.userRole)}>
                              {getRoleDisplayName(session.userRole)}
                            </Badge>
                            <span className="text-xs text-secondary-500">
                              {getRelativeTime(session.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getActionIcon(session.action)}
                            <span className="text-sm text-secondary-900 capitalize">
                              {session.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
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
