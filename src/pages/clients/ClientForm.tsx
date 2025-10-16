import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, User, Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import type { Client } from '@/types'

interface ClientFormProps {
  client?: Client
  isEdit?: boolean
}

export function ClientForm({ client, isEdit = false }: ClientFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()

  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    document: client?.document || '',
    type: (client?.type || 'person') as 'person' | 'company',
    address: client?.address || '',
  })

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

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.document) {
      newErrors.document = 'Documento é obrigatório'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (11) 99999-9999'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (isEdit && client) {
        await updateMutation.mutateAsync({ id: client.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
      navigate('/clients')
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const formatDocument = (value: string, type: string) => {
    const numbers = value.replace(/\D/g, '')
    if (type === 'person') {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value, formData.type)
    setFormData(prev => ({ ...prev, document: formatted }))
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-secondary-600">
            {isEdit ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Tipo *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="person"
                      checked={formData.type === 'person'}
                      onChange={handleChange}
                      className="text-primary-600"
                    />
                    <User className="w-4 h-4" />
                    <span className="text-sm">Pessoa Física</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="company"
                      checked={formData.type === 'company'}
                      onChange={handleChange}
                      className="text-primary-600"
                    />
                    <Building className="w-4 h-4" />
                    <span className="text-sm">Pessoa Jurídica</span>
                  </label>
                </div>
              </div>

              <Input
                label="Nome/Razão Social *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder={formData.type === 'company' ? 'Razão Social' : 'Nome completo'}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={formData.type === 'company' ? 'CNPJ *' : 'CPF *'}
                name="document"
                value={formData.document}
                onChange={handleDocumentChange}
                error={errors.document}
                placeholder={formData.type === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="cliente@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="(11) 99999-9999"
              />

              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Endereço
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="flex w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Endereço completo..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/clients')}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Criar'} Cliente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

