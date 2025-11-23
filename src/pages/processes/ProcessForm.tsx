import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreateProcess, useUpdateProcess } from '@/hooks/useProcesses'
import { useClients } from '@/hooks/useClients'
import type { Process, ProcessType, ProcessStatus } from '@/types'

interface ProcessFormProps {
  process?: Process
  isEdit?: boolean
}

export function ProcessForm({ process, isEdit = false }: ProcessFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateProcess()
  const updateMutation = useUpdateProcess()
  const { data: clients = [] } = useClients()
  const { user } = useAuth()
  const { data: allProcesses = [] } = useProcesses()

  const [formData, setFormData] = useState({
    type: (process?.type || 'civil') as ProcessType,
    clientId: process?.clientId || '',
    status: (process?.status || 'in_progress') as ProcessStatus,
    startDate: process?.startDate || '',
    endDate: process?.endDate || '',
    court: process?.court || '',
    caseNumber: process?.caseNumber || '',
    description: process?.description || '',
    againstWho: process?.againstWho || '',
    involved: process?.involved || '',
    lawyer: process?.lawyer || '',
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [existingAttachments] = useState<string[]>(process?.attachments || [])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientId) {
      newErrors.clientId = 'Cliente é obrigatório'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória'
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileSelect = (file: File) => {
    setAttachments(prev => [...prev, file])
  }

  const handleFileRemove = (fileToRemove: File) => {
    setAttachments(prev => prev.filter(file => file !== fileToRemove))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const limits = getPlanLimits(user?.plan || 'common')
    const activeCasesLimit = limits.activeCases ?? Infinity
    if (Number.isFinite(activeCasesLimit)) {
      const activeCount = (allProcesses || []).filter(p => p.status === 'in_progress' || p.status === 'pending').length
      const isCreatingNew = !isEdit
      if (isCreatingNew && activeCount >= activeCasesLimit) {
        alert('Limite de casos ativos atingido para seu plano. Atualize seu plano para adicionar mais casos.')
        return
      }
    }

    // Simular upload de arquivos (em um sistema real, você faria upload aqui)
    const newAttachmentNames = attachments.map(file => file.name)
    const allAttachments = [...existingAttachments, ...newAttachmentNames]

    const processData = {
      ...formData,
      clientName: clients.find(c => c.id === formData.clientId)?.name || '',
      attachments: allAttachments,
    }

    try {
      if (isEdit && process) {
        await updateMutation.mutateAsync({ id: process.id, data: processData })
      } else {
        await createMutation.mutateAsync(processData)
      }
      navigate('/processes')
    } catch (error) {
      console.error('Erro ao salvar processo:', error)
    }
  }

  const processTypes: { value: ProcessType; label: string }[] = [
    { value: 'civil', label: 'Civil' },
    { value: 'labor', label: 'Trabalhista' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'family', label: 'Família' },
    { value: 'administrative', label: 'Administrativo' },
    { value: 'other', label: 'Outro' },
  ]

  const statusOptions: { value: ProcessStatus; label: string }[] = [
    { value: 'won', label: 'Ganho' },
    { value: 'lost', label: 'Perdido' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'pending', label: 'Pendente' },
  ]

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/processes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Editar Processo' : 'Novo Processo'}
          </h1>
          <p className="text-secondary-600">
            {isEdit ? 'Atualize as informações do processo' : 'Preencha os dados do novo processo'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Tipo do Processo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {processTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Cliente *
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.clientId ? 'border-red-500' : 'border-secondary-300'
                  }`}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-sm text-red-600 mt-1">{errors.clientId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Data de Início *"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
              />

              <Input
                label="Data de Fim"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                helperText="Deixe em branco para processos em andamento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número do Processo"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                placeholder="Ex: 1234567-89.2024.1.01.0001"
              />

              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Tribunal/Vara"
              name="court"
              value={formData.court}
              onChange={handleChange}
              placeholder="Ex: 1ª Vara Cível"
            />

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descrição do processo..."
              />
            </div>

            {/* Novos campos para informações dos envolvidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Informações dos Envolvidos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contra quem será o caso"
                  name="againstWho"
                  value={formData.againstWho}
                  onChange={handleChange}
                  placeholder="Ex: Empresa XYZ Ltda"
                />

                <Input
                  label="Envolvido no caso"
                  name="involved"
                  value={formData.involved}
                  onChange={handleChange}
                  placeholder="Ex: João Silva (Cliente)"
                />
              </div>

              <Input
                label="Advogado responsável"
                name="lawyer"
                value={formData.lawyer}
                onChange={handleChange}
                placeholder="Ex: Dr. Maria Santos - OAB/SP 123456"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Anexos
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                existingFiles={existingAttachments}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
                maxSize={10}
                placeholder="Selecionar arquivos do processo"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/processes')}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Criar'} Processo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
import { useAuth } from '@/hooks/useAuth'
import { useProcesses } from '@/hooks/useProcesses'
import { getPlanLimits } from '@/services/plans'
