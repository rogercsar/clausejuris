import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRegister } from '@/hooks/useAuth'
import type { UserPlan } from '@/types'

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    oab: '',
    phone: '',
    plan: 'common' as UserPlan,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePlanChange = (plan: UserPlan) => {
    setFormData(prev => ({ ...prev, plan }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await registerMutation.mutateAsync(formData)
      navigate('/')
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta' })
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              faça login na sua conta existente
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Plan Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-secondary-700">
                  Escolha seu plano
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.plan === 'common'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                    onClick={() => handlePlanChange('common')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">Plano Comum</h3>
                        <p className="text-2xl font-bold text-primary-600">R$ 30</p>
                        <p className="text-sm text-secondary-500">/mês</p>
                      </div>
                      {formData.plan === 'common' && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <ul className="mt-3 text-sm text-secondary-600 space-y-1">
                      <li>• Editor básico</li>
                      <li>• Gestão de contratos</li>
                      <li>• Gestão de processos</li>
                      <li>• Suporte por email</li>
                    </ul>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.plan === 'pro'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                    onClick={() => handlePlanChange('pro')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">Plano Pró</h3>
                        <p className="text-2xl font-bold text-primary-600">R$ 80</p>
                        <p className="text-sm text-secondary-500">/mês</p>
                      </div>
                      {formData.plan === 'pro' && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <ul className="mt-3 text-sm text-secondary-600 space-y-1">
                      <li>• Editor avançado com IA</li>
                      <li>• Autocomplete de leis</li>
                      <li>• Correção automática</li>
                      <li>• Snippets jurídicos</li>
                      <li>• Suporte prioritário</li>
                    </ul>
                    <Badge variant="success" className="mt-2">
                      Mais Popular
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Seu nome"
                  required
                />

                <Input
                  label="Nome completo"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="seu@email.com"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="OAB (opcional)"
                  name="oab"
                  value={formData.oab}
                  onChange={handleChange}
                  placeholder="123456"
                />

                <Input
                  label="Telefone (opcional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="relative">
                <Input
                  label="Senha"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-secondary-500 hover:text-secondary-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar senha"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-secondary-500 hover:text-secondary-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={registerMutation.isPending}
              >
                Criar conta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

