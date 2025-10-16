import type { 
  Notification, 
  NotificationSettings, 
  NotificationRule, 
  NotificationPriority,
  Contract,
  Process
} from '@/types'

class NotificationService {
  private notifications: Notification[] = []
  private settings: NotificationSettings | null = null
  private rules: NotificationRule[] = []
  private checkInterval: NodeJS.Timeout | null = null

  constructor() {
    this.loadFromStorage()
    this.startPeriodicCheck()
  }

  // Storage methods
  private loadFromStorage() {
    const storedNotifications = localStorage.getItem('notifications')
    if (storedNotifications) {
      this.notifications = JSON.parse(storedNotifications)
    }

    const storedSettings = localStorage.getItem('notificationSettings')
    if (storedSettings) {
      this.settings = JSON.parse(storedSettings)
    }

    const storedRules = localStorage.getItem('notificationRules')
    if (storedRules) {
      this.rules = JSON.parse(storedRules)
    }
  }

  private saveToStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications))
    if (this.settings) {
      localStorage.setItem('notificationSettings', JSON.stringify(this.settings))
    }
    localStorage.setItem('notificationRules', JSON.stringify(this.rules))
  }

  // Notification management
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    this.notifications.unshift(newNotification)
    this.saveToStorage()
    this.showBrowserNotification(newNotification)
    return newNotification
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead)
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      this.saveToStorage()
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true)
    this.saveToStorage()
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.saveToStorage()
  }

  // Settings management
  getSettings(): NotificationSettings | null {
    return this.settings
  }

  updateSettings(settings: Partial<NotificationSettings>): void {
    if (!this.settings) {
      this.settings = {
        id: `settings-${Date.now()}`,
        userId: 'current-user', // In real app, get from auth context
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
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    this.settings = {
      ...this.settings,
      ...settings,
      updatedAt: new Date().toISOString()
    }

    this.saveToStorage()
  }

  // Rules management
  getRules(): NotificationRule[] {
    return this.rules
  }

  createRule(rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): NotificationRule {
    const newRule: NotificationRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.rules.push(newRule)
    this.saveToStorage()
    return newRule
  }

  updateRule(ruleId: string, updates: Partial<NotificationRule>): void {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = {
        ...this.rules[ruleIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.saveToStorage()
    }
  }

  deleteRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId)
    this.saveToStorage()
  }

  // Automatic notification generation
  checkContractsForNotifications(contracts: Contract[]): void {
    if (!this.settings) return

    contracts.forEach(contract => {
      if (!contract.endDate || contract.status !== 'active') return

      const endDate = new Date(contract.endDate)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Check if we should notify for this contract
      const shouldNotify = this.settings?.contractExpiryDays?.includes(daysUntilExpiry) || false
      const notificationType = daysUntilExpiry <= 0 ? 'contract_expired' : 'contract_expiring'

      if (shouldNotify && this.settings?.notificationTypes?.[notificationType]) {
        // Check if notification already exists
        const existingNotification = this.notifications.find(n => 
          n.entityId === contract.id && 
          n.type === notificationType &&
          !n.isRead
        )

        if (!existingNotification) {
          this.createNotification({
            type: notificationType,
            title: daysUntilExpiry <= 0 
              ? 'Contrato Expirado' 
              : `Contrato Expirando em ${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''}`,
            message: `O contrato "${contract.clientName}" ${daysUntilExpiry <= 0 ? 'expirou' : `expira em ${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''}`}.`,
            entityId: contract.id,
            entityType: 'contract',
            entityName: contract.clientName,
            priority: this.getPriorityForDays(daysUntilExpiry),
            metadata: {
              daysUntilExpiry,
              amount: contract.value
            }
          })
        }
      }
    })
  }

  checkProcessesForNotifications(processes: Process[]): void {
    if (!this.settings) return

    processes.forEach(process => {
      if (!process.endDate || process.status !== 'in_progress') return

      const endDate = new Date(process.endDate)
      const today = new Date()
      const daysUntilDeadline = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Check if we should notify for this process
      const shouldNotify = this.settings?.processDeadlineDays?.includes(daysUntilDeadline) || false
      const notificationType = daysUntilDeadline <= 0 ? 'process_urgent' : 'process_deadline'

      if (shouldNotify && this.settings?.notificationTypes?.[notificationType]) {
        // Check if notification already exists
        const existingNotification = this.notifications.find(n => 
          n.entityId === process.id && 
          n.type === notificationType &&
          !n.isRead
        )

        if (!existingNotification) {
          this.createNotification({
            type: notificationType,
            title: daysUntilDeadline <= 0 
              ? 'Prazo Processual Vencido' 
              : `Prazo Processual em ${daysUntilDeadline} dia${daysUntilDeadline !== 1 ? 's' : ''}`,
            message: `O processo "${process.clientName}" tem prazo ${daysUntilDeadline <= 0 ? 'vencido' : `vencendo em ${daysUntilDeadline} dia${daysUntilDeadline !== 1 ? 's' : ''}`}.`,
            entityId: process.id,
            entityType: 'process',
            entityName: process.clientName,
            priority: this.getPriorityForDays(daysUntilDeadline),
            metadata: {
              daysUntilExpiry: daysUntilDeadline
            }
          })
        }
      }
    })
  }

  // Browser notification
  private showBrowserNotification(notification: Notification): void {
    if (!this.settings?.browserNotifications) return

    // Check if we're in quiet hours
    if (this.settings.quietHours.enabled) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const startTime = this.parseTime(this.settings.quietHours.start)
      const endTime = this.parseTime(this.settings.quietHours.end)

      if (this.isInQuietHours(currentTime, startTime, endTime)) {
        return
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  private isInQuietHours(currentTime: number, startTime: number, endTime: number): boolean {
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  private getPriorityForDays(days: number): NotificationPriority {
    if (days <= 0) return 'urgent'
    if (days <= 1) return 'high'
    if (days <= 7) return 'medium'
    return 'low'
  }

  // Periodic check
  private startPeriodicCheck(): void {
    // Check every hour
    this.checkInterval = setInterval(() => {
      this.performPeriodicCheck()
    }, 60 * 60 * 1000)
  }

  private performPeriodicCheck(): void {
    // This would typically fetch fresh data from the API
    // For now, we'll just clean up old notifications
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    this.notifications = this.notifications.filter(n => 
      new Date(n.createdAt) > thirtyDaysAgo
    )
    this.saveToStorage()
  }

  // Request browser notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Cleanup
  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
