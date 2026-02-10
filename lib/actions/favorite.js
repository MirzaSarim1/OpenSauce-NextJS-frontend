"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(recipeId) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId: session.user.id,
                    recipeId: recipeId
                }
            }
        })

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    userId_recipeId: {
                        userId: session.user.id,
                        recipeId: recipeId
                    }
                }
            })
        } else {
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    recipeId: recipeId
                }
            })
        }

        revalidatePath('/recipes')
        revalidatePath('dashboard')
        revalidatePath('favorites')
        revalidatePath(`/recipes/${recipeId}`)

        return { success: true }
    } catch (error) {
        console.error("Error toggling favorite:", error)
        return { error: "Failed to update favorite" }
    }
}

export async function checkIsFavorited(recipeId, userId) {
    if (!userId) return false

    try {
        const isFavorited = await prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId: userId,
                    recipeId: recipeId
                }
            }
        })

        return isFavorited ? true : false
    } catch (error) {
        console.error("Error checking favorite:", error)
        return false
    }
}

export async function getUserFavorites(userId) {
    if (!userId) {
        return { recipes: [], pagination: { page: 1, totalPages: 0, total: 0 } }
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                recipe: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        _count: {
                            select: {
                                favorites: true,
                                reviews: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                assignedAt: 'desc'
            }
        })

        const recipes = favorites.map(fav => fav.recipe)

        return {
            recipes,
            pagination: {
                page: 1,
                totalPages: 1,
                total: recipes.length
            }
        }
    } catch (error) {
        console.error("Error fetching favorites:", error)
        return { recipes: [], pagination: { page: 1, totalPages: 0, total: 0 } }
    }
}
