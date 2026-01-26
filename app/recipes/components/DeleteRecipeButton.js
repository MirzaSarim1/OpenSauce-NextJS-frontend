"use client"

import { useState } from "react"
import { deleteRecipe } from "@/lib/actions/recipe"
import { useRouter } from "next/navigation"

export default function DeleteRecipeButton({ recipeId }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteRecipe(recipeId)
        
        if (result?.error) {
            alert(result.error)
            setIsDeleting(false)
        } else {
            router.push("/recipes")
            router.refresh()
        }
    }

    if (showConfirm) {
        return (
            <div className="flex gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
        >
            Delete
        </button>
    )
}
