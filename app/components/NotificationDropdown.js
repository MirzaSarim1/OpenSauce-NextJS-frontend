'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash, faCheckDouble, faBell } from '@fortawesome/free-solid-svg-icons'
import { useNotifications } from '@/hooks/useNotifications'
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/actions/notification'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationDropdown({ onClose }) {
  const router = useRouter()
  const { notifications: liveNotifications, removeNotification, refreshUnreadCount } = useNotifications()
  const [allNotifications, setAllNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadNotifications() {
      const { notifications } = await getUserNotifications(20)
      setAllNotifications(notifications || [])
      setLoading(false)
    }
    loadNotifications()
  }, [])

  const mergedNotifications = [
    ...liveNotifications,
    ...allNotifications.filter(
      (notification) => !liveNotifications.find((n) => n.id === notification.id)
    ),
  ].slice(0, 20)

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
      refreshUnreadCount()
    }

    if (notification.data?.actionUrl) {
      router.push(notification.data.actionUrl)
    }

    onClose()
  }

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllAsRead()
      refreshUnreadCount()
      
      setAllNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
    })
  }

  const handleDelete = (e, notificationId) => {
    e.stopPropagation()
    
    startTransition(async () => {
      await deleteNotification(notificationId)
      removeNotification(notificationId)
      setAllNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      refreshUnreadCount()
    })
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-dropdown')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="notification-dropdown absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[32rem] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
        {mergedNotifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            Loading notifications...
          </div>
        ) : mergedNotifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faBell} className="w-12 h-12 mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mergedNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !notification.read ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                          refreshUnreadCount()
                        }}
                        className="text-green-500 hover:text-green-600 dark:text-green-400 cursor-pointer hover:scale-110 transition-transform"
                        title="Mark as read"
                      >
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition-transform"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mergedNotifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={() => {
              router.push('/notifications')
              onClose()
            }}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium cursor-pointer"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}