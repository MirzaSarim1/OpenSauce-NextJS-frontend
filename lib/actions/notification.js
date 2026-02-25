'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { revalidatePath } from 'next/cache';

export async function createNotification(userId, { type, title, message, data = null }) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
      },
    })

    await pusherServer.trigger(
      `user-${userId}`,
      'new-notification',
      notification
    )

    return { success: true, notification }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserNotifications(limit = 10, skip = 0) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    })

    return { success: true, notifications }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: error.message, notifications: [] }
  }
}

export async function getUnreadCount() {
  const session = await auth()
  if (!session?.user) {
    return { success: true, count: 0 }
  }

  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return { success: true, count }
  } catch (error) {
    console.error('Error counting notifications:', error)
    return { success: false, count: 0 }
  }
}

export async function markAsRead(notificationId) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: { read: true },
    });

    await pusherServer.trigger(
      `user-${session.user.id}`,
      'notification-read',
      { notificationId }
    )

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: error.message }
  }
}

export async function markAllAsRead() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    await pusherServer.trigger(
      `user-${session.user.id}`,
      'all-notifications-read',
      {}
    )

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteNotification(notificationId) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    const notification = await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    })

    await pusherServer.trigger(
      `user-${session.user.id}`,
      'notification-deleted',
      { notificationId, wasUnread: !notification.read }
    )

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: error.message }
  }
}
