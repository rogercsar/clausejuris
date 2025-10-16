import { useState, useEffect } from 'react'
import { Bell, Clock, Mail, Smartphone, Save, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { useNotifications } from '@/hooks/useNotifications'
import type { NotificationSettings, NotificationType } from '@/types'

interface NotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSettingsModal({ isOpen, onClose }: NotificationSettingsProps) {
  const { settings, updateSettings, requestNotificationPermission } = useNotifications()
  const [formData, setFormData] = useState<Partial<NotificationSettings>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [testNotificationSent, setTestNotificationSent] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    } else {
      // Initialize with default values
      setFormData({
        emailNotifications: true,
        browserNotifications: true,
        contractExpiryDays: [30, 15, 7, 1],
        processDeadlineDays: [30, 15, 7, 1],
        paymentReminderDays: [7, 3, 1],
        courtHearingReminderDays: [7, 3, 1],
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        },
        notificationTypes: {
          contract_expiring: true,
          contract_expired: true,
          process_deadline: true,
          process_urgent: true,
          payment_due: true,
          document_required: true,
          court_hearing: true,
          custom: true
        }
      })
    }
  }, [settings])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings(formData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestNotification = async () => {
    const hasPermission = await requestNotificationPermission()
    if (hasPermission) {
      // Create a test notification
      const testNotification = {
        type: 'custom' as NotificationType,
        title: 'Teste de Notificação',
        message: 'Esta é uma notificação de teste do sistema Clause.',
        entityId: 'test',
        entityType: 'contract' as const,
        entityName: 'Teste',
        priority: 'medium' as const,
        metadata: {
          customData: { test: true }
        }
      }
      
      // Import and use the notification service directly
      const { notificationService } = await import('@/services/notificationService')
      await notificationService.createNotification(testNotification)
      setTestNotificationSent(true)
      setTimeout(() => setTestNotificationSent(false), 3000)
    }
  }

  const updateNotificationType = (type: NotificationType, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: enabled
      } as NotificationSettings['notificationTypes']
    }))
  }

  const updateDaysArray = (field: keyof NotificationSettings, value: string) => {
    const days = value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d))
    setFormData(prev => ({
      ...prev,
      [field]: days
    }))
  }

  const notificationTypeLabels: Record<NotificationType, string> = {
    contract_expiring: 'Contratos Expirando',
    contract_expired: 'Contratos Expirados',
    process_deadline: 'Prazos Processuais',
    process_urgent: 'Processos Urgentes',
    payment_due: 'Pagamentos Devidos',
    document_required: 'Documentos Necessários',
    court_hearing: 'Audiências',
    custom: 'Notificações Personalizadas'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurações de Notificações
          </DialogTitle>
          <DialogDescription>
            Configure como e quando receber notificações sobre contratos e processos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] px-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Notificações por Email</div>
                    <div className="text-sm text-gray-600">Receber notificações por email</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Notificações do Navegador</div>
                    <div className="text-sm text-gray-600">Receber notificações no navegador</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.browserNotifications || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, browserNotifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestNotification}
                  disabled={testNotificationSent}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {testNotificationSent ? 'Enviado!' : 'Testar Notificação'}
                </Button>
                {testNotificationSent && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Notificação de teste enviada
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Tempo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dias antes do vencimento de contratos
                  </label>
                  <Input
                    placeholder="30, 15, 7, 1"
                    value={formData.contractExpiryDays?.join(', ') || ''}
                    onChange={(e) => updateDaysArray('contractExpiryDays', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe os dias por vírgula (ex: 30, 15, 7, 1)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dias antes de prazos processuais
                  </label>
                  <Input
                    placeholder="30, 15, 7, 1"
                    value={formData.processDeadlineDays?.join(', ') || ''}
                    onChange={(e) => updateDaysArray('processDeadlineDays', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dias antes de pagamentos
                  </label>
                  <Input
                    placeholder="7, 3, 1"
                    value={formData.paymentReminderDays?.join(', ') || ''}
                    onChange={(e) => updateDaysArray('paymentReminderDays', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dias antes de audiências
                  </label>
                  <Input
                    placeholder="7, 3, 1"
                    value={formData.courtHearingReminderDays?.join(', ') || ''}
                    onChange={(e) => updateDaysArray('courtHearingReminderDays', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário Silencioso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Ativar horário silencioso</div>
                  <div className="text-sm text-gray-600">Não receber notificações durante este período</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.quietHours?.enabled || false}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours!,
                        enabled: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.quietHours?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Início</label>
                    <Input
                      type="time"
                      value={formData.quietHours?.start || '22:00'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        quietHours: {
                          ...prev.quietHours!,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fim</label>
                    <Input
                      type="time"
                      value={formData.quietHours?.end || '08:00'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        quietHours: {
                          ...prev.quietHours!,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(notificationTypeLabels).map(([type, label]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notificationTypes?.[type as NotificationType] || false}
                        onChange={(e) => updateNotificationType(type as NotificationType, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
