import { useState, useEffect, useCallback } from 'react'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRealtimeActive, setRealtimeActive] = useState(false)
  const [pageSize] = useState(20)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const { user } = useAuthStore()

  // --- Callbacks & actions

  const loadNotifications = useCallback(async () => {
    const { items, total } = await notificationService.getNotificationsPage(0, pageSize)
    setNotifications(items)
    setTotal(total)
    setOffset(items.length)
    setHasMore(items.length < total)
  }, [pageSize])

  const loadMoreNotifications = useCallback(async () => {
    if (!hasMore) return
    setIsLoadingMore(true)
    try {
      const { items } = await notificationService.getNotificationsPage(offset, pageSize)
      const newOffset = offset + items.length
      setNotifications(prev => [...prev, ...items])
      setOffset(newOffset)
      setHasMore(newOffset < total)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, offset, pageSize, total])

  const loadSettings = useCallback(async () => {
    const currentSettings = await notificationService.getSettingsAsync()
    setSettings(currentSettings)
  }, [])

  const loadRules = useCallback(() => {
    const currentRules = notificationService.getRules()
    setRules(currentRules)
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationService.markAsRead(notificationId)
    await loadNotifications()
  }, [loadNotifications])

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead()
    await loadNotifications()
  }, [loadNotifications])

  const deleteNotification = useCallback(async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId)
    await loadNotifications()
  }, [loadNotifications])

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    const withUserId = { ...newSettings, userId: user?.id ?? 'current-user' }
    await notificationService.updateSettings(withUserId)
    await loadSettings()
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

  // --- Effects (placed after callbacks to avoid TS "used before assigned")

  // Load initial data
  useEffect(() => {
    // Load from Supabase when available, fallback to local storage
    loadNotifications()
    loadSettings()
    loadRules()
    // Intencionalmente não adicionamos dependências para carregar apenas uma vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time updates via Supabase
  useEffect(() => {
    if (!hasSupabaseConfig || !user?.id) return

    const notifChannel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, async () => {
        await loadNotifications()
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeActive(true)
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtimeActive(false)
      })

    const settingsChannel = supabase
      .channel(`notification_settings:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notification_settings',
        filter: `user_id=eq.${user.id}`
      }, async () => {
        await loadSettings()
      })
      .subscribe()

    return () => {
      setRealtimeActive(false)
      supabase.removeChannel(notifChannel)
      supabase.removeChannel(settingsChannel)
    }
  }, [user?.id, loadNotifications, loadSettings])

  return {
    notifications,
    settings,
    rules,
    isLoading,
    isLoadingMore,
    isRealtimeActive,
    hasMore,
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
    loadMoreNotifications,
    loadSettings,
    loadRules
  }
}
