import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIndexedDb } from './useIndexedDb'
import { useStableData } from './useStableData'
import { useStableIntelligence } from './useStableIntelligence'
import { isToday } from '../utils/format'

const readIdsKey = 'notification-read-ids'

export interface StableNotification {
  id: string
  title: string
  message: string
  createdAt: string
  href: string
  tone: 'urgent' | 'attention' | 'activity'
}

export function useStableNotifications() {
  const { horses, activities } = useStableData()
  const { attentionInsights } = useStableIntelligence()
  const { read, write } = useIndexedDb()
  const navigate = useNavigate()
  const [readIds, setReadIds] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let mounted = true
    void read<string[]>(readIdsKey).then((storedIds) => {
      if (!mounted) return
      setReadIds(storedIds ?? [])
      setIsHydrated(true)
    })
    return () => {
      mounted = false
    }
  }, [read])

  const notifications = useMemo<StableNotification[]>(() => {
    const insightNotifications = attentionInsights.map((insight) => ({
      id: `insight:${insight.horseId}:${insight.severity}`,
      title: insight.title,
      message: `${insight.horseName} · ${insight.summary}`,
      createdAt: insight.lastActivityDate
        ? `${insight.lastActivityDate}T12:00:00`
        : new Date().toISOString(),
      href: `/horses/${insight.horseId}`,
      tone: insight.severity === 'urgent' ? 'urgent' as const : 'attention' as const,
    }))

    const todaysActivities = activities
      .filter((activity) => isToday(activity.date))
      .flatMap((activity) => {
        const horse = horses.find((item) => item.id === activity.horseId)
        if (!horse) return []
        return {
          id: `activity:${activity.id}`,
          title: `${activity.type} recorded`,
          message: `${horse.name} · ${activity.notes}`,
          createdAt: activity.createdAt,
          href: `/horses/${horse.id}`,
          tone: 'activity' as const,
        }
      })

    return [...insightNotifications, ...todaysActivities]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  }, [activities, attentionInsights, horses])

  const unreadCount = notifications.filter((notification) => !readIds.includes(notification.id)).length

  const markRead = useCallback(async (notificationId: string) => {
    const nextReadIds = [...new Set([...readIds, notificationId])]
    await write(readIdsKey, nextReadIds)
    setReadIds(nextReadIds)
  }, [read, readIds, write])

  const markAllRead = useCallback(async () => {
    const nextReadIds = [...new Set([...readIds, ...notifications.map(({ id }) => id)])]
    await write(readIdsKey, nextReadIds)
    setReadIds(nextReadIds)
  }, [notifications, readIds, write])

  const openNotification = useCallback(async (notification: StableNotification) => {
    await markRead(notification.id)
    navigate(notification.href)
  }, [markRead, navigate])

  return {
    notifications,
    unreadCount,
    isHydrated,
    isRead: (notificationId: string) => readIds.includes(notificationId),
    markRead,
    markAllRead,
    openNotification,
  }
}
