import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Scale, Calendar, FileText, User, CheckSquare, MessageSquare, Users, FolderOpen, Clock } from 'lucide-react'
import { PrintButton } from '@/components/ui/PrintButton'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CrossReferencePanel } from '@/components/cross-reference/CrossReferencePanel'
import { TasksManagerModal } from '@/components/tasks/TasksManager'
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel'
import { TeamManagerModal } from '@/components/collaboration/TeamManager'
import { RelationshipsPanel } from '@/components/relationships/RelationshipsPanel'
import { useProcesses } from '@/hooks/useProcesses'
import { useProcessesStore, type ProcessTimelineEvent } from '@/store/processes'
import { formatDate, getProcessTypeLabel, getProcessStatusLabel, getStatusColor } from '@/lib/utils'
import { getTasksByProcess, getDeadlinesByProcess, getCalendarEventsByProcess } from '@/data/tasks'

export function ProcessDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: processes = [] } = useProcesses()
  const store = useProcessesStore()
  const timelineEventsByProcess: Record<string, ProcessTimelineEvent[]> = store.timelineEvents
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [showCollaborationModal, setShowCollaborationModal] = useState(false)
  const [showTeamManagerModal, setShowTeamManagerModal] = useState(false)
  
  const process = (processes as any[]).find((p: any) => p.id === id)

  if (!process) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Scale className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Processo não encontrado
          </h2>
          <p className="text-secondary-600 mb-6">
            O processo solicitado não foi encontrado ou foi removido.
          </p>
          <Button onClick={() => navigate('/processes')}>
            Voltar para Processos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Top Row - Back button and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/processes')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 truncate">
              {process.clientName}
            </h1>
            <p className="text-sm sm:text-base text-secondary-600 truncate">
              {getProcessTypeLabel(process.type)} • {formatDate(process.startDate)}
            </p>
          </div>
          <Badge className={getStatusColor(process.status, 'process')}>
            {getProcessStatusLabel(process.status)}
          </Badge>
        </div>

        {/* Action Buttons - Responsive layout */}
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          <Button
            variant="outline"
            size="sm"
            onClick={() => process.clientId ? navigate(`/clients/${process.clientId}/files`) : undefined}
            disabled={!process.clientId}
            title={process.clientId ? 'Abrir pasta do cliente' : 'Cliente sem ID disponível'}
            className="flex-shrink-0"
          >
            <FolderOpen className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Pasta do Cliente</span>
            <span className="sm:hidden">Pasta</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTasksModal(true)}
            className="flex-shrink-0"
          >
            <CheckSquare className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Tarefas</span>
            <span className="sm:hidden">Tarefas</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCollaborationModal(true)}
            className="flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Colaboração</span>
            <span className="sm:hidden">Colab</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTeamManagerModal(true)}
            className="flex-shrink-0"
          >
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Equipes</span>
            <span className="sm:hidden">Equipes</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/processes/${process.id}/edit`)}
            className="flex-shrink-0"
          >
            <Edit className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Editar</span>
            <span className="sm:hidden">Editar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Process Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Cliente</p>
                    <p className="font-medium">{process.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Tipo</p>
                    <p className="font-medium">{getProcessTypeLabel(process.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Data de Início</p>
                    <p className="font-medium">{formatDate(process.startDate)}</p>
                  </div>
                </div>
                {process.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-600">Data de Fim</p>
                      <p className="font-medium">{formatDate(process.endDate)}</p>
                    </div>
                  </div>
                )}
                {process.caseNumber && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-600">Número do Processo</p>
                      <p className="font-medium font-mono text-sm">{process.caseNumber}</p>
                    </div>
                  </div>
                )}
                {process.court && (
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-600">Tribunal/Vara</p>
                      <p className="font-medium">{process.court}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Status</p>
                    <Badge className={getStatusColor(process.status, 'process')}>
                      {getProcessStatusLabel(process.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {process.description && (
                <div className="pt-4 border-t border-secondary-200">
                  <h4 className="font-medium text-secondary-900 mb-2">Descrição</h4>
                  <p className="text-secondary-600">{process.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {process.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Anexos</CardTitle>
                <CardDescription>
                  Documentos relacionados ao processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {process.attachments.map((attachment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm font-medium">{attachment}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline do Caso</CardTitle>
              <CardDescription>Eventos, prazos e atividades do processo</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const tasks = getTasksByProcess(process.id)
                const deadlines = getDeadlinesByProcess(process.id)
                const calendarEvents = getCalendarEventsByProcess(process.id)
                const statusEvents = timelineEventsByProcess[process.id] || []
                const items = [
                  {
                    id: `start-${process.id}`,
                    date: process.startDate,
                    title: 'Início do processo',
                    description: getProcessTypeLabel(process.type),
                    type: 'start' as const,
                  },
                  ...tasks.map(t => ({
                    id: t.id,
                    date: t.dueDate,
                    title: t.title,
                    description: t.description,
                    type: 'task' as const,
                  })),
                  ...deadlines.map(d => ({
                    id: d.id,
                    date: d.dueDate,
                    title: d.title,
                    description: d.description,
                    type: 'deadline' as const,
                  })),
                  ...calendarEvents.map(e => ({
                    id: e.id,
                    date: e.startDate,
                    title: e.title,
                    description: e.description,
                    type: 'calendar' as const,
                  })),
                  ...statusEvents.map((e: ProcessTimelineEvent) => ({
                    id: e.id,
                    date: e.date,
                    title: e.title,
                    description: getProcessStatusLabel(e.description || ''),
                    type: 'status' as const,
                  })),
                  ...(process.endDate ? [{
                    id: `end-${process.id}`,
                    date: process.endDate,
                    title: 'Encerramento do processo',
                    description: getProcessStatusLabel(process.status),
                    type: 'end' as const,
                  }] : []),
                ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

                const typeBadge = (type: 'start' | 'task' | 'deadline' | 'calendar' | 'status' | 'end') => {
                  switch (type) {
                    case 'start':
                      return <Badge variant="outline" className="text-xs">início</Badge>
                    case 'task':
                      return <Badge variant="outline" className="text-xs">tarefa</Badge>
                    case 'deadline':
                      return <Badge variant="outline" className="text-xs">prazo</Badge>
                    case 'calendar':
                      return <Badge variant="outline" className="text-xs">agenda</Badge>
                    case 'status':
                      return <Badge variant="outline" className="text-xs">status</Badge>
                    case 'end':
                      return <Badge variant="outline" className="text-xs">fim</Badge>
                    default:
                      return null
                  }
                }

                const typeIcon = (type: 'start' | 'task' | 'deadline' | 'calendar' | 'status' | 'end') => {
                  switch (type) {
                    case 'start':
                      return <Calendar className="w-4 h-4 text-blue-600" />
                    case 'task':
                      return <CheckSquare className="w-4 h-4 text-green-600" />
                    case 'deadline':
                      return <Clock className="w-4 h-4 text-orange-600" />
                    case 'calendar':
                      return <Calendar className="w-4 h-4 text-teal-600" />
                    case 'status':
                      return <Badge className="text-xs">S</Badge>
                    case 'end':
                      return <Calendar className="w-4 h-4 text-purple-600" />
                    default:
                      return <Clock className="w-4 h-4 text-gray-600" />
                  }
                }

                return (
                  <div className="space-y-3">
                    {items.map(ev => (
                      <div key={ev.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {typeIcon(ev.type)}
                        </div>
                        <div className="flex-1">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{ev.title}</h4>
                                <span className="text-xs text-secondary-500">{formatDate(ev.date)}</span>
                              </div>
                              {ev.description && (
                                <p className="text-sm text-secondary-600 mb-2">{ev.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-secondary-500">
                                {typeBadge(ev.type)}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cross Reference Panel */}
          <CrossReferencePanel
            entityType="process"
            entityId={process.id}
            entityName={process.clientName}
          />

          {/* Relationships Panel */}
          <RelationshipsPanel
            entityType="process"
            entityId={process.id}
            entityName={process.clientName}
          />
        </div>
      </div>

      {/* Tasks Modal */}
      <TasksManagerModal
        isOpen={showTasksModal}
        onClose={() => setShowTasksModal(false)}
        processId={process.id}
      />

      {/* Collaboration Modal */}
      <CollaborationPanel
        isOpen={showCollaborationModal}
        onClose={() => setShowCollaborationModal(false)}
        entityType="process"
        entityId={process.id}
        entityName={process.clientName}
      />

      {/* Team Manager Modal */}
      <TeamManagerModal
        isOpen={showTeamManagerModal}
        onClose={() => setShowTeamManagerModal(false)}
      />
    </div>
  )
}
