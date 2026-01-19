"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const name = formData.get("name")
    const bio = formData.get("bio")
    const image = formData.get("image")

    if (!name || name.trim().length === 0) {
        return { error: "Name is required" }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name.trim(),
                bio: bio?.trim() || null,
                image: image?.trim() || null,
            }
        })

        revalidatePath("/profile")
        return { success: true, message: "Profile updated successfully" }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Failed to update profile" }
    }
}