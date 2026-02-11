import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserNotifications } from '@/lib/actions/notification'
import NotificationsList from './components/NotificationsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

export const metadata = {
  title: 'Notifications | Open Sauce',
  description: 'View all your notifications',
}

export default async function NotificationsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const { notifications } = await getUserNotifications(50)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faBell} className="text-orange-500" />
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Stay updated with all your activity
        </p>
      </div>

      <NotificationsList initialNotifications={notifications || []} />
    </div>
  )
}