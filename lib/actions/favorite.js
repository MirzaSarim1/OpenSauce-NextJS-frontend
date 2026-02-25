"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createNotification } from "@/lib/actions/notification"

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

            const recipe = await prisma.recipe.findUnique({
                where: { id: recipeId },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            if (recipe && recipe.authorId !== session.user.id) {
                const favoriter = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { name: true }
                })

                try {
                    await createNotification(recipe.authorId, {
                        type: 'FAVORITE',
                        title: 'New favorite',
                        message: `${favoriter?.name || 'Someone'} added your recipe: ${recipe.title} as their favorites`,
                        data: {
                            recipeId: recipe.id,
                            recipeTitle: recipe.title,
                            favoriterId: session.user.id,
                            favoriterName: favoriter?.name,
                        },
                    })
                } catch (notificationError) {
                    console.error('Error sending favorite notification:', notificationError)
                }
            }
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
