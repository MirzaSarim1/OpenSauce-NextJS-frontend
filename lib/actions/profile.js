"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

export async function updateProfile(formData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const name = formData.get("name")
    const bio = formData.get("bio")
    const imageFile = formData.get("image")
    const removeImage = formData.get("removeImage")

    if (!name || name.trim().length === 0) {
        return { error: "Name is required" }
    }

    try {
        const updateData = {
            name: name.trim(),
            bio: bio?.trim() || null,
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { imagePublicId: true }
        })

        if (removeImage === "true") {
            if (currentUser?.imagePublicId) {
                await deleteImage(currentUser.imagePublicId)
            }
            updateData.image = null
            updateData.imagePublicId = null
        }
        else if (imageFile && imageFile.size > 0) {
            if (imageFile.size > 5 * 1024 * 1024) {
                return { error: "Image size must be less than 5MB" }
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!validTypes.includes(imageFile.type)) {
                return { error: "Invalid image format. Use JPG, PNG, or WebP" }
            }

            if (currentUser?.imagePublicId) {
                await deleteImage(currentUser.imagePublicId)
            }

            const { url, publicId } = await uploadImage(imageFile)
            
            updateData.image = url
            updateData.imagePublicId = publicId
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })

        revalidatePath("/profile")
        revalidatePath("/profile/edit")
        
        return { success: true, message: "Profile updated successfully" }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: error.message || "Failed to update profile" }
    }
}