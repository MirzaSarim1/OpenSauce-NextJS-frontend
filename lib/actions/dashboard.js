"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getDashboardData() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    try {
        const userId = session.user.id

        const recipesCount = await prisma.recipe.count({
            where: { authorId: userId }
        })

        const recentRecipes = await prisma.recipe.findMany({
            where: { authorId: userId },
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        favorites: true,
                        reviews: true
                    }
                }
            }
        })

        const totalFavorites = await prisma.favorite.count({
            where: {
                recipe: {
                    authorId: userId
                }
            }
        })

        const totalReviews = await prisma.review.count({
            where: {
                recipe: {
                    authorId: userId
                }
            }
        })

        const favoritedRecipesCount = await prisma.favorite.count({
            where: { userId }
        })

        return {
            recipesCount,
            recentRecipes,
            totalFavorites,
            totalReviews,
            favoritedRecipesCount
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        return null
    }
}
