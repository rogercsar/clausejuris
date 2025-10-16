import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, FileText, Calendar, DollarSign, User, CheckSquare, MessageSquare, Users, FolderOpen } from 'lucide-react'
import { PrintButton } from '@/components/ui/PrintButton'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CrossReferencePanel } from '@/components/cross-reference/CrossReferencePanel'
import { TasksManagerModal } from '@/components/tasks/TasksManager'
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel'
import { TeamManagerModal } from '@/components/collaboration/TeamManager'
import { RelationshipsPanel } from '@/components/relationships/RelationshipsPanel'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatDate, getContractTypeLabel, getContractStatusLabel, getStatusColor } from '@/lib/utils'

export function ContractDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: contracts = [] } = useContracts()
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [showCollaborationModal, setShowCollaborationModal] = useState(false)
  const [showTeamManagerModal, setShowTeamManagerModal] = useState(false)
  
  const contract = (contracts as any[]).find((c: any) => c.id === id)

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Contrato não encontrado
          </h2>
          <p className="text-secondary-600 mb-6">
            O contrato solicitado não foi encontrado ou foi removido.
          </p>
          <Button onClick={() => navigate('/contracts')}>
            Voltar para Contratos
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
            onClick={() => navigate('/contracts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 truncate">
              {contract.clientName}
            </h1>
            <p className="text-sm sm:text-base text-secondary-600 truncate">
              {getContractTypeLabel(contract.type)} • {formatDate(contract.startDate)}
            </p>
          </div>
          <Badge className={getStatusColor(contract.status, 'contract')}>
            {getContractStatusLabel(contract.status)}
          </Badge>
        </div>

        {/* Action Buttons - Responsive layout */}
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          <Button
            variant="outline"
            size="sm"
            onClick={() => contract.clientId ? navigate(`/clients/${contract.clientId}/files`) : undefined}
            disabled={!contract.clientId}
            title={contract.clientId ? 'Abrir pasta do cliente' : 'Cliente sem ID disponível'}
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
            onClick={() => navigate(`/contracts/${contract.id}/edit`)}
            className="flex-shrink-0"
          >
            <Edit className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Editar</span>
            <span className="sm:hidden">Editar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Cliente</p>
                    <p className="font-medium">{contract.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Tipo</p>
                    <p className="font-medium">{getContractTypeLabel(contract.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Data de Início</p>
                    <p className="font-medium">{formatDate(contract.startDate)}</p>
                  </div>
                </div>
                {contract.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-600">Data de Fim</p>
                      <p className="font-medium">{formatDate(contract.endDate)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Valor</p>
                    <p className="font-medium">{formatCurrency(contract.value)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Status</p>
                    <Badge className={getStatusColor(contract.status, 'contract')}>
                      {getContractStatusLabel(contract.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {contract.description && (
                <div className="pt-4 border-t border-secondary-200">
                  <h4 className="font-medium text-secondary-900 mb-2">Descrição</h4>
                  <p className="text-secondary-600">{contract.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {contract.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Anexos</CardTitle>
                <CardDescription>
                  Documentos relacionados ao contrato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contract.attachments.map((attachment: any, index: number) => (
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
            entityType="contract"
            entityId={contract.id}
            entityName={contract.clientName}
          />

          {/* Relationships Panel */}
          <RelationshipsPanel
            entityType="contract"
            entityId={contract.id}
            entityName={contract.clientName}
          />
        </div>
      </div>

      {/* Tasks Modal */}
      <TasksManagerModal
        isOpen={showTasksModal}
        onClose={() => setShowTasksModal(false)}
        contractId={contract.id}
      />

      {/* Collaboration Modal */}
      <CollaborationPanel
        isOpen={showCollaborationModal}
        onClose={() => setShowCollaborationModal(false)}
        entityType="contract"
        entityId={contract.id}
        entityName={contract.clientName}
      />

      {/* Team Manager Modal */}
      <TeamManagerModal
        isOpen={showTeamManagerModal}
        onClose={() => setShowTeamManagerModal(false)}
      />
    </div>
  )
}
