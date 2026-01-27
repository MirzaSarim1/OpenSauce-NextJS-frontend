"use client"

import { useState } from "react"
import { deleteRecipe } from "@/lib/actions/recipe"
import { useRouter } from "next/navigation"

export default function DeleteRecipeButton({ recipeId }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)
        const result = await deleteRecipe(recipeId)
        
        if (result?.error) {
            setError(result.error)
            setIsDeleting(false)
        } else {
            router.push("/recipes")
            router.refresh()
        }
    }

    if (showConfirm) {
        return (
            <div className="space-y-3">
                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isDeleting ? "Deleting..." : "Confirm"}
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirm(false)
                            setError(null)
                        }}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
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
