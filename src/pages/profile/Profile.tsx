import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUpdateProfile, useUpgradePlan } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { NotificationSettingsModal } from '@/components/notifications/NotificationSettings'
import { 
  User, 
  FileText, 
  Crown,
  Save,
  CheckCircle,
  Bell
} from 'lucide-react'
import { FileUpload } from '@/components/ui/FileUpload'

export function Profile() {
  const { user } = useAuth()
  const updateMutation = useUpdateProfile()
  const upgradeMutation = useUpgradePlan()
  
  const [isEditing, setIsEditing] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    oab: user?.oab || '',
    phone: user?.phone || '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAvatarSelect = (file: File) => {
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarRemove = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const updateData: any = { ...formData }
      if (avatarFile) {
        // Em um sistema real, aqui você faria upload do arquivo
        // Por enquanto, vamos simular com uma URL mock
        updateData.avatar = URL.createObjectURL(avatarFile)
      }
      
      await updateMutation.mutateAsync(updateData)
      setIsEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  const handleUpgrade = () => {
    upgradeMutation.mutate('pro')
  }

  const isPro = user?.plan === 'pro'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Perfil</h1>
          <p className="text-secondary-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPro ? 'success' : 'secondary'}>
            {isPro ? 'Plano Pró' : 'Plano Comum'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize seus dados pessoais e profissionais
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} isLoading={updateMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {user?.name}
                  </h3>
                  <p className="text-secondary-600">{user?.fullName}</p>
                </div>
              </div>

              {/* Avatar Upload */}
              {isEditing && (
                <div className="mt-4">
                  <FileUpload
                    onFileSelect={handleAvatarSelect}
                    onFileRemove={handleAvatarRemove}
                    accept="image/*"
                    maxSize={5}
                    placeholder="Selecionar foto do perfil"
                    className="max-w-md"
                  />
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  disabled={!isEditing}
                />

                <Input
                  label="Nome Completo"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  disabled={!isEditing}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={!isEditing}
                />

                <Input
                  label="OAB"
                  name="oab"
                  value={formData.oab}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="123456"
                />

                <Input
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {isPro ? 'Plano Pró' : 'Plano Comum'}
                  </h3>
                  <p className="text-secondary-600">
                    {isPro ? 'R$ 80/mês' : 'R$ 30/mês'}
                  </p>
                  <p className="text-sm text-secondary-500 mt-1">
                    {isPro 
                      ? 'Acesso completo a todos os recursos'
                      : 'Recursos básicos de gestão jurídica'
                    }
                  </p>
                </div>
                {!isPro && (
                  <Button onClick={handleUpgrade} isLoading={upgradeMutation.isPending}>
                    <Crown className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-secondary-600">Contratos</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-secondary-600">Processos</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-secondary-600">Clientes</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>
                Configure como e quando receber notificações sobre contratos e processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={() => setShowNotificationSettings(true)}
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                Configurar Notificações
              </Button>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos Inclusos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gestão de contratos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gestão de processos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Cadastro de clientes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Editor básico</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sistema de notificações</span>
                </div>
                {isPro && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Editor com IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Autocomplete de leis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Modelos jurídicos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Suporte prioritário</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  )
}
