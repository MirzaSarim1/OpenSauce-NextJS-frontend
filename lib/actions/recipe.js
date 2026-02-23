"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ERROR_MESSAGES } from "@/lib/constants"
import { createNotification } from "@/lib/actions/notification"

export async function createRecipe(formData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const title = formData.get("title")
    const description = formData.get("description")
    const instructions = formData.get("instructions")
    const prepTime = formData.get("prepTime")
    const cookTime = formData.get("cookTime")
    const difficulty = formData.get("difficulty")
    const imageFile = formData.get("image")
    const cuisine = formData.get("cuisine");

    const ingredientsData = formData.get("ingredients")
    const categories = formData.get("categories")
    const tags = formData.get("tags")

    if (!title || title.trim().length === 0) {
        return { error: "Title is Required" }
    }

    if (!description || description.trim().length === 0) {
        return { error: "Description is Required" }
    }

    if (!instructions || instructions.trim().length === 0) {
        return { error: "Instructions are Required" }
    }

    if (!prepTime || prepTime.trim().length <= 0) {
        return { error: "Preperation Time must be greater than zero" }
    }

    if (!cookTime || cookTime.trim().length <= 0) {
        return { error: "Cooking Time must be greater than zero" }
    }

    try {
        const recipeData = {
            title: title.trim(),
            description: description.trim(),
            instructions: instructions.trim(),
            prepTime: parseInt(prepTime),
            cookTime: parseInt(cookTime),
            difficulty: difficulty || "MEDIUM",
            authorId: session.user.id,
            cuisine,
        }

        if (imageFile && imageFile.size > 0) {

            if (imageFile.size > MAX_FILE_SIZE) {
                return { error: ERROR_MESSAGES.IMAGE_SIZE_EXCEEDED }
            }

            if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
                return { error: ERROR_MESSAGES.INVALID_IMAGE_FORMAT }
            }

            const { url, publicId } = await uploadImage(imageFile, 'open-sauce/recipes')

            recipeData.image = url
            recipeData.imagePublicId = publicId
        }

        let ingredients = []
        if (ingredientsData) {
            try {
                ingredients = JSON.parse(ingredientsData)
            } catch (e) {
                return { error: "Invalid ingredients format" }
            }
        }

        let categoryNames = []
        if (categories && categories.trim()) {
            categoryNames = categories.split(',').map(name => name.trim()).filter(Boolean)
        }

        let tagNames = []
        if (tags && tags.trim()) {
            tagNames = tags.split(',').map(name => name.trim()).filter(Boolean)
        }

        const recipe = await prisma.recipe.create({
            data: {
                ...recipeData,
                ingredients: {
                    create: ingredients.map(ingredient => ({
                        quantity: ingredient.quantity,
                        unit: ingredient.unit || null,
                        ingredient: {
                            connectOrCreate: {
                                where: { name: ingredient.name.toLowerCase() },
                                create: { name: ingredient.name.toLowerCase() }
                            }
                        }
                    }))
                },
                categories: {
                    connectOrCreate: categoryNames.map(name => ({
                        where: { name: name },
                        create: { name: name }
                    }))
                },
                tags: {
                    connectOrCreate: tagNames.map(name => ({
                        where: { name: name },
                        create: { name: name }
                    }))
                }
            }
        })

        try {
            const followers = await prisma.follow.findMany({
                where: { followingId: session.user.id },
                select: { followerId: true }
            })

            const author = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { name: true }
            })

            if (followers.length > 0) {
                const notificationPromises = followers.map(follower =>
                    createNotification(follower.followerId, {
                        type: 'NEW_RECIPE',
                        title: 'New Recipe from Someone You Follow',
                        message: `${author?.name || 'Someone'} just posted a new recipe: ${recipe.title}`,
                        data: {
                            recipeId: recipe.id,
                            recipeTitle: recipe.title,
                            authorId: session.user.id,
                            authorName: author?.name,
                        },
                    })
                )

                Promise.all(notificationPromises).catch(error => {
                    console.error('Error sending recipe notifications:', error)
                })
            }
        } catch (notificationError) {
            console.error('Error notifying followers about new recipe:', notificationError)
        }

        revalidatePath("/recipes")
        revalidatePath("dashboard")

        return { success: true, recipeId: recipe.id }
    } catch (error) {
        return { error: error.message || "Failed to create recipe" }
    }
}

export async function getRecipe(recipeId) {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                categories: true,
                tags: true,
                _count: {
                    select: {
                        favorites: true,
                        reviews: true
                    }
                }
            }
        })

        return recipe
    } catch (error) {
        console.error("Error fetching recipe:", error)
        return null
    }
}

export async function getRecipes({
    page = 1,
    limit = 12,
    difficulty,
    cuisine,
    search,
    sortBy = 'recent',
    category,
    tag
} = {}) {
    try {
        const skip = (page - 1) * limit

        const where = {}
        if (difficulty) {
            where.difficulty = difficulty
        }

        if (cuisine) {
            where.cuisine = cuisine
        }

        if (category) {
            where.categories = {
                some: {
                    name: category
                }
            }
        }

        if (tag) {
            where.tags = {
                some: {
                    name: tag
                }
            }
        }

        if (search && search.trim()) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    ingredients: {
                        some: {
                            ingredient: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        }
                    }
                }
            ]
        }

        let orderBy
        if (sortBy === 'recent') {
            orderBy = { createdAt: 'desc' }
        } else if (sortBy === 'popular') {
            orderBy = { favorites: { _count: 'desc' } }
        } else {
            orderBy = { averageRating: 'desc' }
        }

        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    author: {
                        select: { id: true, name: true, image: true }
                    },
                    _count: {
                        select: {
                            favorites: true,
                            reviews: true
                        }
                    }
                }
            }),
            prisma.recipe.count({ where })
        ])

        return {
            recipes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching recipes:", error)
        return { recipes: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } }
    }
}

export async function deleteRecipe(recipeId) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthrized" }
    }

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: {
                authorId: true,
                imagePublicId: true,
            }
        })

        if (!recipe) {
            return { error: "Recipe Not Foound" }
        }

        if (recipe.authorId !== session.user.id) {
            return { error: "Unauthorized" }
        }

        if (recipe.imagePublicId) {
            await deleteImage(recipe.imagePublicId)
        }

        await prisma.recipe.delete({
            where: { id: recipeId }
        })

        revalidatePath("/recipes")
        revalidatePath("/dashboard")
    } catch (error) {
        return { error: "Failed to delete recipe" }
    }
}

export async function updateRecipe(recipeId, formData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: {
                authorId: true,
                imagePublicId: true,
            }
        })

        if (!existingRecipe) {
            return { error: "Recipe not found" }
        }

        if (existingRecipe.authorId !== session.user.id) {
            return { error: "Unauthorized" }
        }

        const title = formData.get("title")
        const description = formData.get("description")
        const instructions = formData.get("instructions")
        const prepTime = formData.get("prepTime")
        const cookTime = formData.get("cookTime")
        const difficulty = formData.get("difficulty")
        const imageFile = formData.get("image")
        const ingredientsData = formData.get("ingredients")
        const cuisine = formData.get("cuisine")

        if (!title || title.trim().lnegth === 0) {
            return { error: "Title is Required" }
        }

        if (!description || description.trim() === 0) {
            return { error: "Description is Required" }
        }

        if (!instructions || instructions.trim() === 0) {
            return { error: "instructions are Required" }
        }

        if (!prepTime || prepTime.trim().length <= 0) {
            return { error: "Preparation Time must be greater than zero" }
        }

        if (!cookTime || cookTime.trim().length <= 0) {
            return { error: "Cooking Time must be greater than zero" }
        }

        const recipeData = {
            title: title.trim(),
            description: description.trim(),
            instructions: instructions.trim(),
            prepTime: parseInt(prepTime),
            cookTime: parseInt(cookTime),
            difficulty: difficulty || "MEDIUM",
            cuisine: cuisine || "OTHER",
        }

        if (imageFile && imageFile.size > 0) {
            if (existingRecipe.imagePublicId) {
                await deleteImage(existingRecipe.imagePublicId)
            }

            const uploadResult = await uploadImage(imageFile, "open-sauce/recipes")
            recipeData.image = uploadResult.url
            recipeData.imagePublicId = uploadResult.publicid
        }

        let ingredients = []
        if (ingredientsData) {
            try {
                ingredients = JSON.parse(ingredientsData)
            } catch (e) {
                return { error: "Invalid ingredients format" }
            }
        }

        if (!ingredients || ingredients.length === 0) {
            return { error: "At least one ingredient is required" }
        }

        await prisma.recipeIngredient.deleteMany({
            where: { recipeId }
        })

        const recipe = await prisma.recipe.update({
            where: { id: recipeId },
            data: {
                ...recipeData,
                ingredients: {
                    create: ingredients.map(ingredient => ({
                        quantity: ingredient.quantity,
                        unit: ingredient.unit || null,
                        ingredient: {
                            connectOrCreate: {
                                where: { name: ingredient.name.toLowerCase().trim() },
                                create: { name: ingredient.name.toLowerCase().trim() }
                            }
                        }
                    }))
                }
            }
        })

        revalidatePath(`/recipes/${recipeId}`)
        revalidatePath("/recipes")
        revalidatePath("/dashboard")

        return { success: true, recipeId: recipe.id }
    } catch (error) {
        console.error("Error updating recipe:", error)
        return { error: error.message || "Failed to update recipe" }
    }
}
