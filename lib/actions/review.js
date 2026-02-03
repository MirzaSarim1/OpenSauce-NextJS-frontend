"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ERROR_MESSAGES } from "../constants"

export async function createReview(recipeId, formData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "You must be logged in to leave a review" }
    }

    const rating = parseInt(formData.get("rating"))
    const comment = formData.get("comment")

    if (!rating || rating < 1 || rating > 5) {
        return { error: ERROR_MESSAGES.INVALID_RATING_LIMIT }
    }

    if (comment && comment.trim().length > 500) {
        return { error: ERROR_MESSAGES.COMMENT_LIMIT_EXCEEDED }
    }
    
    try {
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_recipeId: {
                    userId: session.user.id,
                    recipeId: recipeId
                }
            }
        })

        if (existingReview) {
            return { error: "You have already reviewed this recipe" }
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment: comment?.trim() || null,
                userId: session.user.id,
                recipeId
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                }
            }
        })

        await updateRecipeAverageRating(recipeId)

        revalidatePath(`/recipes/${recipeId}`)

        return { success: true, review }
    } catch (error) {
        console.error("Error creating review:", error)
        return { error: error.message || "Failed to create reviw" }
    }
}

export async function updateReview(reviewId, formData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "You must be logged in to update a review"}
    }

    const rating = parseInt(formData.get("rating"))
    const comment = formData.get("comment")

    if (!rating || rating < 1 || rating > 5) {
        return { error: ERROR_MESSAGES.INVALID_RATING_LIMIT }
    }

    if (comment && comment.trim().length > 500) {
        return { error: ERROR_MESSAGES.COMMENT_LIMIT_EXCEEDED }
    }
    
    try {
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (!existingReview) {
            return { error: "Review not found" }
        }

        if (existingReview.userId !== session.user.id) {
            return { error: "You can only edit your own reviews" }
        }

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment: comment?.trim() || null
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                }
            }
        })

        await updateRecipeAverageRating(existingReview.recipeId)

        revalidatePath(`/recipes/${existingReview.recipeId}`)

        return { success: true, review }
    } catch(error) {
        console.error("Error updating review:", error)
        return { error: error.message || "Failed to update review" }
    }
}

export async function deleteReview(reviewId) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "You must be logged in to delete a review" }
    }

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (!existingReview) {
            return { error: "Review not found" }
        }

        if (existingReview.userId !== session.user.id) {
            return { error: "You can only delete your own reviews" }
        }

        const recipeId = existingReview.recipeId

        await prisma.review.delete({
            where: { id: reviewId }
        })

        await updateRecipeAverageRating(recipeId)

        revalidatePath(`/recipes/${recipeId}`)

        return { success: true }
    } catch (error) {
        console.error("Error deleting review:", error)
        return { error: error.message || "Failed to delete review" }
    }
}

async function updateRecipeAverageRating(recipeId) {
    try {
        const reviews = await prisma.review.findMany({
            where: { recipeId },
            select: { rating: true }
        })

        let averageRating = 0
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
            const average = sum / reviews.length
            averageRating = Math.round(average * 2) / 2
        }

        await prisma.recipe.update({
            where: { id: recipeId },
            data: { averageRating }
        })

        return averageRating
    } catch (error) {
        console.error("Error updating recipe average rating:", error)
        throw error
    }
}

export async function getReviewsForRecipe(recipeId, options = {}) {
    const {
        sortBy = 'newest',
        page = 1,
        limit = 10
    } = options

    try {
        let orderBy
        switch (sortBy) {
            case 'oldest':
                orderBy = { createdAt: 'asc' }
                break
            case 'highest':
                orderBy = { rating: 'desc' }
                break
            case 'lowest':
                orderBy = { rating: 'asc' }
                break
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' }
                break
        }

        const skip = (page - 1) * limit

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { recipeId },
                include: {
                    user: {
                        select: { id: true, name: true, image: true }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.review.count({ where: { recipeId } })
        ])

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return { reviews: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } }
    }
}

export async function getUserReviewForRecipe(recipeId) {
    const session = await auth()

    if (session?.user?.id) {
        return null
    }

    try {
        const review = await prisma.review.findUnique({
            where: {
                userId_recipeId: {
                    userId: session.user.id,
                    recipeId
                }
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                }
            }
        })

        return review
    } catch (error) {
        console.error("Error fetching user review:", error)
        return null
    }
}
