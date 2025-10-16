import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Building, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import type { Client, SupplierType } from '@/types'

interface SupplierFormProps {
  supplier?: Client
  isEdit?: boolean
}

export function SupplierForm({ supplier, isEdit = false }: SupplierFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()

  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    document: supplier?.document || '',
    address: supplier?.address || '',
    type: (supplier?.type || 'company') as SupplierType,
    category: 'Outros',
    rating: 5,
    notes: '',
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
      newErrors.name = 'Razão Social é obrigatória'
    }

    if (!formData.document) {
      newErrors.document = formData.type === 'company' ? 'CNPJ é obrigatório' : 'CPF é obrigatório'
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

    const supplierData = {
      ...formData,
      type: formData.type as 'person' | 'company',
    }

    try {
      if (isEdit && supplier) {
        await updateMutation.mutateAsync({ id: supplier.id, data: supplierData })
      } else {
        await createMutation.mutateAsync(supplierData)
      }
      navigate('/suppliers')
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formData.type === 'company' ? formatCNPJ(value) : formatCPF(value)
    setFormData(prev => ({ ...prev, document: formatted }))
  }

  const categories = [
    'Tecnologia',
    'Consultoria',
    'Serviços Jurídicos',
    'Contabilidade',
    'Marketing',
    'Design',
    'Comunicação',
    'Outros'
  ]

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/suppliers')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h1>
          <p className="text-secondary-600">
            {isEdit ? 'Atualize as informações do fornecedor' : 'Preencha os dados do novo fornecedor'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Informações do Fornecedor
          </CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Fornecedor */}
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Tipo de Fornecedor *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="company"
                    checked={formData.type === 'company'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Pessoa Jurídica
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="individual"
                    checked={formData.type === 'individual'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Pessoa Física
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={formData.type === 'company' ? 'Razão Social *' : 'Nome Completo *'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder={formData.type === 'company' ? 'Nome da empresa' : 'Nome completo'}
                required
              />

              <Input
                label={formData.type === 'company' ? 'CNPJ *' : 'CPF *'}
                name="document"
                value={formData.document}
                onChange={handleDocumentChange}
                error={errors.document}
                placeholder={formData.type === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="contato@empresa.com"
              />

              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Avaliação
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="text-2xl"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-secondary-600 ml-2">
                    {formData.rating}/5
                  </span>
                </div>
              </div>
            </div>

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
                placeholder="Endereço completo da empresa..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="flex w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Informações adicionais sobre o fornecedor..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/suppliers')}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Criar'} Fornecedor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
