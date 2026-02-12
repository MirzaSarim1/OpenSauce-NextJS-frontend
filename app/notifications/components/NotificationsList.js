'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCheck, faTrash, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { markAsRead, markAllAsRead, deleteNotification } from '@/lib/actions/notification'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsList({ initialNotifications }) {
  const router = useRouter()
  const { notifications: liveNotifications, removeNotification, refreshUnreadCount } = useNotifications()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isPending, startTransition] = useTransition()

  const allNotifications = [
    ...liveNotifications,
    ...notifications.filter(
      (notification) => !liveNotifications.find((n) => n.id === notification.id)
    ),
  ]

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
      refreshUnreadCount()
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
    }

    if (notification.data?.actionUrl) {
      router.push(notification.data.actionUrl)
    }
  }

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllAsRead()
      refreshUnreadCount()
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
    })
  }

  const handleDelete = (notificationId) => {
    startTransition(async () => {
      await deleteNotification(notificationId)
      removeNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      refreshUnreadCount()
    })
  }

  const hasUnread = allNotifications.some((n) => !n.read)

  return (
    <div>
      {hasUnread && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            Mark all as read
          </button>
        </div>
      )}

      {allNotifications.length === 0 ? (
        <div className="text-center py-16">
          <FontAwesomeIcon
            icon={faBell}
            className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                !notification.read
                  ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                        refreshUnreadCount()
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        )
                      }}
                      className="p-2 text-green-500 hover:text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification.id)
                    }}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}