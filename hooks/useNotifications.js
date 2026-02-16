'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Pusher from 'pusher-js'
import { getUnreadCount } from '@/lib/actions/notification'

let pusherInstance = null

function getPusherClient() {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
  }
  return pusherInstance
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    getUnreadCount().then(({ count }) => setUnreadCount(count || 0))
  }, [session?.user])

  useEffect(() => {
    if (!session?.user?.id) return

    const pusher = getPusherClient()
    const channelName = `user-${session.user.id}`
    const channel = pusher.subscribe(channelName)

    const onConnected = () => setIsConnected(true)
    const onDisconnected = () => setIsConnected(false)

    pusher.connection.bind('connected', onConnected)
    pusher.connection.bind('disconnected', onDisconnected)
    pusher.connection.bind('error', onDisconnected)

    if (pusher.connection.state === 'connected') setIsConnected(true)

    channel.bind('new-notification', (notification) => {
      setNotifications((prev) =>
        prev.some((n) => n.id === notification.id) ? prev : [notification, ...prev]
      )
      setUnreadCount((prev) => prev + 1)
    })

    channel.bind('notification-read', ({ notificationId }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    })

    channel.bind('all-notifications-read', () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    })

    channel.bind('notification-deleted', ({ notificationId }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
      pusher.connection.unbind('connected', onConnected)
      pusher.connection.unbind('disconnected', onDisconnected)
      pusher.connection.unbind('error', onDisconnected)
    }
  }, [session?.user?.id])

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user) return
    const { count } = await getUnreadCount()
    setUnreadCount(count || 0)
  }, [session?.user])

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  return {
    notifications,
    unreadCount,
    isConnected,
    refreshUnreadCount,
    removeNotification,
    refresh: refreshUnreadCount,
  }
}