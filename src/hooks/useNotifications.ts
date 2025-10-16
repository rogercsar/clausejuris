import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '@/services/notificationService'
import { useAuthStore } from '@/store/auth'
import type { 
  Notification, 
  NotificationSettings, 
  NotificationRule,
  Contract,
  Process
} from '@/types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()

  // Load initial data
  useEffect(() => {
    loadNotifications()
    loadSettings()
    loadRules()
  }, [])

  const loadNotifications = useCallback(() => {
    const allNotifications = notificationService.getNotifications()
    setNotifications(allNotifications)
  }, [])

  const loadSettings = useCallback(() => {
    const currentSettings = notificationService.getSettings()
    setSettings(currentSettings)
  }, [])

  const loadRules = useCallback(() => {
    const currentRules = notificationService.getRules()
    setRules(currentRules)
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId)
    loadNotifications()
  }, [loadNotifications])

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead()
    loadNotifications()
  }, [loadNotifications])

  const deleteNotification = useCallback((notificationId: string) => {
    notificationService.deleteNotification(notificationId)
    loadNotifications()
  }, [loadNotifications])

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const withUserId = { ...newSettings, userId: user?.id ?? 'current-user' }
    notificationService.updateSettings(withUserId)
    loadSettings()
  }, [loadSettings, user?.id])

  const createRule = useCallback((rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule = notificationService.createRule(rule)
    loadRules()
    return newRule
  }, [loadRules])

  const updateRule = useCallback((ruleId: string, updates: Partial<NotificationRule>) => {
    notificationService.updateRule(ruleId, updates)
    loadRules()
  }, [loadRules])

  const deleteRule = useCallback((ruleId: string) => {
    notificationService.deleteRule(ruleId)
    loadRules()
  }, [loadRules])

  const checkContractsForNotifications = useCallback((contracts: Contract[]) => {
    setIsLoading(true)
    try {
      notificationService.checkContractsForNotifications(contracts)
      loadNotifications()
    } finally {
      setIsLoading(false)
    }
  }, [loadNotifications])

  const checkProcessesForNotifications = useCallback((processes: Process[]) => {
    setIsLoading(true)
    try {
      notificationService.checkProcessesForNotifications(processes)
      loadNotifications()
    } finally {
      setIsLoading(false)
    }
  }, [loadNotifications])

  const requestNotificationPermission = useCallback(async () => {
    return await notificationService.requestNotificationPermission()
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    notifications,
    settings,
    rules,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    createRule,
    updateRule,
    deleteRule,
    checkContractsForNotifications,
    checkProcessesForNotifications,
    requestNotificationPermission,
    loadNotifications,
    loadSettings,
    loadRules
  }
}
