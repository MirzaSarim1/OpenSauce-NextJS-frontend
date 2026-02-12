'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount, isConnected } = useNotifications()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {!isConnected && (
          <span 
            className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full" 
            title="Connecting..." 
          />
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  )
}