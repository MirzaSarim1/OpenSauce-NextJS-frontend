'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/actions/notification"
import { revalidatePath } from "next/cache"

export async function toggleFollow(targetUserId) {
    const session = await auth()

    if (!session?.user) {
        return { success: false, error: "Unauthorized" }
    }

    if (session.user.id === targetUserId) {
        return { succes: false, error: "Cannot follow yourself" }
    }

    try {
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId,
                },
            },
        })

        if (existingFollow) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: session.user.id,
                        followingId: targetUserId,
                    },
                },
            })

            revalidatePath(`/profile/${session.user.name}`)
            return { success: true, isFollowing: false }
        } else {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: targetUserId,
                },
            })

            const follower = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { name: true },
            })

            await createNotification(targetUserId, {
                type: 'FOLLOW',
                title: 'New Follower',
                message: `${follower?.name || 'Someone'} started following you`,
                data: {
                    followerId: session.user.id,
                    followerName: follower?.name,
                },
            })

            revalidatePath(`/profile/${session.user.name}`)
            return { success: true, isFollowing: true }
        }
    } catch (error) {
        console.error('Error toggling follow:', error)
        return { success: false, error: error.message }
    }
}

export async function checkIsFollowing(targetUserId) {
    const session = await auth()

    if (!session?.user) {
        return { isFollowing: false }
    }

    try {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId,
                },
            },
        })

        return { isFollowing: Boolean(follow) }
    } catch (error) {
        console.error('Error checking follow status:', error)
        return { isFollowing: false }
    }
}
