"use client"

import { useState } from "react"
import StarRating from "./StarRating"
import ReviewForm from "./ReviewForm"
import { deleteReview } from "@/lib/actions/review"
import { useRouter } from "next/navigation"

export default function ReviewCard({ review, currentUserId, recipeId }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isOwner = currentUserId === review.userId

    const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this review?")) {
            return
        }

        setLoading(true)
        const result = await deleteReview(review.id)

        if (result?.error) {
            alert(result.error)
            setLoading(false)
        } else {
            window.location.reload()
        }
    }

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
                <div className="mb-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Edit Your Review</h3>
                </div>
                <ReviewForm recipeId={recipeId} existingReview={review} />
                <button
                    onClick={() => setIsEditing(false)}
                    className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {review.user.image ? (
                        <img
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {review.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                            {review.user.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <StarRating rating={review.rating} readonly size="sm" />
            </div>

            {review.comment && (
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {review.comment}
                </p>
            )}
        </div>
    )
}
