import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Scale, Calendar, FileText, User, CheckSquare, MessageSquare, Users, FolderOpen } from 'lucide-react'
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
import { formatDate, getProcessTypeLabel, getProcessStatusLabel, getStatusColor } from '@/lib/utils'

export function ProcessDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: processes = [] } = useProcesses()
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
