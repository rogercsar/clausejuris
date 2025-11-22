import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, Trash2, Clock, AlertTriangle, FileText, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { useNotifications } from '@/hooks/useNotifications'
import type { NotificationPriority } from '@/types'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    isRealtimeActive,
    hasMore,
    isLoadingMore,
    loadMoreNotifications
  } = useNotifications()
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority | ''>('')

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    notifications.forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1
    })
    return counts
  }, [notifications])

  const priorityCounts = useMemo(() => {
    const counts: Record<NotificationPriority, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    }
    notifications.forEach(n => {
      counts[n.priority] = (counts[n.priority] || 0) + 1
    })
    return counts
  }, [notifications])

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low':
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract_expiring':
      case 'contract_expired':
        return <FileText className="w-4 h-4 text-blue-600" />
      case 'process_deadline':
      case 'process_urgent':
        return <Calendar className="w-4 h-4 text-green-600" />
      case 'payment_due':
        return <DollarSign className="w-4 h-4 text-yellow-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract_expiring':
      case 'contract_expired':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'process_deadline':
      case 'process_urgent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'payment_due':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case 'contract_expiring':
        return 'Contrato expirando'
      case 'contract_expired':
        return 'Contrato expirado'
      case 'process_deadline':
        return 'Prazo de processo'
      case 'process_urgent':
        return 'Processo urgente'
      case 'payment_due':
        return 'Pagamento devido'
      case 'document_required':
        return 'Documento requerido'
      case 'court_hearing':
        return 'Audiência'
      case 'custom':
        return 'Custom'
      default:
        return 'Outro'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours < 24) {
      return `Há ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Há ${diffInDays} dia${diffInDays !== 1 ? 's' : ''}`
    }
  }

  const filteredNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(n => {
    const matchesRead = filter === 'unread' ? !n.isRead : true
    const matchesType = typeFilter ? n.type === typeFilter : true
    const matchesPriority = priorityFilter ? n.priority === priorityFilter : true
    return matchesRead && matchesType && matchesPriority
  })

  const groupedByDay = useMemo(() => {
    const groups: Record<string, any[]> = {}
    filteredNotifications.forEach(n => {
      const key = new Date(n.createdAt).toISOString().split('T')[0]
      groups[key] = groups[key] || []
      groups[key].push(n)
    })
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [filteredNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId)
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
            {isRealtimeActive && (
              <span className="ml-auto flex items-center gap-1 text-xs text-green-700">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Ao vivo
              </span>
            )}
            {unreadCount > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                {unreadCount} não lidas
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Acompanhe suas notificações sobre contratos e processos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6">
          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Não lidas ({unreadCount})
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tipo: Todos ({notifications.length})</option>
                <option value="contract_expiring">Contrato expirando ({typeCounts['contract_expiring'] || 0})</option>
                <option value="contract_expired">Contrato expirado ({typeCounts['contract_expired'] || 0})</option>
                <option value="process_deadline">Prazo de processo ({typeCounts['process_deadline'] || 0})</option>
                <option value="process_urgent">Processo urgente ({typeCounts['process_urgent'] || 0})</option>
                <option value="payment_due">Pagamento devido ({typeCounts['payment_due'] || 0})</option>
                <option value="document_required">Documento requerido ({typeCounts['document_required'] || 0})</option>
                <option value="court_hearing">Audiência ({typeCounts['court_hearing'] || 0})</option>
                <option value="custom">Custom ({typeCounts['custom'] || 0})</option>
              </select>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as NotificationPriority | '')}
              >
                <option value="">Prioridade: Todas ({notifications.length})</option>
                <option value="urgent">Urgente ({priorityCounts.urgent || 0})</option>
                <option value="high">Alta ({priorityCounts.high || 0})</option>
                <option value="medium">Média ({priorityCounts.medium || 0})</option>
                <option value="low">Baixa ({priorityCounts.low || 0})</option>
              </select>
            </div>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3 max-h-[45vh] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">
                    {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação encontrada'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              groupedByDay.map((entry) => {
                const day = entry[0]
                const items = entry[1]
                return (
                <div key={day}>
                  <div className="text-xs font-semibold text-secondary-700 mb-2">{new Date(day).toLocaleDateString('pt-BR')}</div>
                  {items.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`transition-colors ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className={`font-medium text-sm ${
                                  !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-gray-500">
                                    {notification.entityName}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(notification.createdAt)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getTypeColor(notification.type)}`}
                                >
                                  {getTypeIcon(notification.type)}
                                  <span className="ml-1">{formatTypeLabel(notification.type)}</span>
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {getPriorityIcon(notification.priority)}
                                  <span className="ml-1 capitalize">{notification.priority}</span>
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3">
                              {!notification.isRead && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Marcar como lida
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                              {(notification.entityType === 'process' || notification.entityType === 'contract') && (
                                <Link to={`/${notification.entityType === 'process' ? 'processes' : 'contracts'}/${notification.entityId}`}>
                                  <Button variant="outline" size="sm">Abrir</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )
              })
            )}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMoreNotifications}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
              </Button>
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
