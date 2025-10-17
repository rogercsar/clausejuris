import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreateContract, useUpdateContract } from '@/hooks/useContracts'
import { useClients } from '@/hooks/useClients'
import type { Contract, ContractType, ContractStatus } from '@/types'

interface ContractFormProps {
  contract?: Contract
  isEdit?: boolean
}

export function ContractForm({ contract, isEdit = false }: ContractFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateContract()
  const updateMutation = useUpdateContract()
  const { data: clients = [] } = useClients()

  const [formData, setFormData] = useState({
    type: (contract?.type || 'rental') as ContractType,
    clientId: contract?.clientId || '',
    startDate: contract?.startDate || '',
    endDate: contract?.endDate || '',
    value: contract?.value?.toString() || '',
    status: (contract?.status || 'active') as ContractStatus,
    description: contract?.description || '',
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [existingAttachments] = useState<string[]>(contract?.attachments || [])

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

    if (!formData.value) {
      newErrors.value = 'Valor é obrigatório'
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = 'Valor deve ser um número positivo'
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

    // Simular upload de arquivos (em um sistema real, você faria upload aqui)
    const newAttachmentNames = attachments.map(file => file.name)
    const allAttachments = [...existingAttachments, ...newAttachmentNames]

    const contractData = {
      ...formData,
      value: Number(formData.value),
      clientName: clients.find(c => c.id === formData.clientId)?.name || '',
      attachments: allAttachments,
    }

    try {
      if (isEdit && contract) {
        await updateMutation.mutateAsync({ id: contract.id, data: contractData })
      } else {
        await createMutation.mutateAsync(contractData)
      }
      navigate('/contracts')
    } catch (error) {
      const err: any = error
      const message =
        (err && (err.message || err.error_description || err.error)) ||
        (error instanceof Error ? error.message : '') ||
        'Erro desconhecido'
      const details = err?.details || err?.hint || ''
      const code = err?.code || ''
      console.error('Erro ao salvar contrato:', { message, code, details, raw: err })
    }
  }

  const contractTypes: { value: ContractType; label: string }[] = [
    { value: 'rental', label: 'Locação' },
    { value: 'service', label: 'Prestação de Serviços' },
    { value: 'purchase_sale', label: 'Compra e Venda' },
    { value: 'partnership', label: 'Sociedade' },
    { value: 'employment', label: 'Trabalhista' },
    { value: 'other', label: 'Outro' },
  ]

  const statusOptions: { value: ContractStatus; label: string }[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'ended', label: 'Encerrado' },
    { value: 'terminated', label: 'Rescindido' },
  ]

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/contracts')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Editar Contrato' : 'Novo Contrato'}
          </h1>
          <p className="text-secondary-600">
            {isEdit ? 'Atualize as informações do contrato' : 'Preencha os dados do novo contrato'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Tipo do Contrato *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {contractTypes.map((type) => (
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
                helperText="Deixe em branco para contratos sem data de fim definida"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Valor (R$) *"
                name="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={handleChange}
                error={errors.value}
                placeholder="0,00"
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
                placeholder="Descrição adicional do contrato..."
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
                placeholder="Selecionar arquivos do contrato"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contracts')}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Criar'} Contrato
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
