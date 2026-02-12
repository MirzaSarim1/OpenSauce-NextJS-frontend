'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { getUnreadCount } from '@/lib/actions/notification'

const POLL_INTERVAL = 10000

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionType, setConnectionType] = useState('polling')
  
  const intervalRef = useRef(null)
  const lastFetchRef = useRef(new Date().toISOString())

  useEffect(() => {
    if (!session?.user) return

    async function fetchInitialCount() {
      const { count } = await getUnreadCount()
      setUnreadCount(count || 0)
    }

    fetchInitialCount()
  }, [session?.user])

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/notifications/latest?since=${lastFetchRef.current}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      
      if (data.success) {
        if (data.notifications.length > 0) {
          setNotifications((prev) => {
            const newNotifications = data.notifications.filter(
              (n) => !prev.find((existing) => existing.id === n.id)
            )
            return [...newNotifications, ...prev]
          })
          
          lastFetchRef.current = new Date().toISOString()
        }
        
        setUnreadCount(data.unreadCount)
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Error polling notifications:', error)
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    fetchNotifications()

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session?.user?.id, fetchNotifications])

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user) return
    
    const { count } = await getUnreadCount()
    setUnreadCount(count || 0)
  }, [session?.user])

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  const refresh = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionType,
    refreshUnreadCount,
    removeNotification,
    refresh,
  }
}