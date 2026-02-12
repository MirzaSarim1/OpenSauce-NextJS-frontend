import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const since = searchParams.get('since')
  
  try {
    const where = {
      userId: session.user.id,
    }

    if (since) {
      where.createdAt = {
        gt: new Date(since),
      }
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
