"use client"

import { useState, useTransition } from "react"
import { toggleFavorite } from "@/lib/actions/favorite"

export default function FavoriteButton({ recipeId, initialIsFavorited, showLabel = false }) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            setIsFavorited(!isFavorited)

            const result = await toggleFavorite(recipeId)

            if (result.error) {
                setIsFavorited(isFavorited)
                alert(result.error)
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${isFavorited
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-red-500 hover:text-red-500"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <i className={`fa-${isFavorited ? "solid" : "regular"} fa-heart`}></i>
            {showLabel && (
                <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>
            )}
        </button>
    )
}