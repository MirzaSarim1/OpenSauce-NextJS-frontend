"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import StarRating from "./StarRating"
import { createReview, updateReview } from "@/lib/actions/review"

export default function ReviewForm({ recipeId, existingReview = null }) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [comment, setComment] = useState(existingReview?.comment || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const isEdit = existingReview ? true : false

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        if (rating === 0) {
            setError("Please select a rating")
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.set("rating", rating.toString())
            formData.set("comment", comment)

            const result = isEdit
                ? await updateReview(existingReview.id, formData)
                : await createReview(recipeId, formData)

            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                window.location.reload()
            }
        } catch (err) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Your Rating *
                </label>
                <StarRating
                    rating={rating}
                    onChange={setRating}
                    size="lg"
                />
                {rating > 0 && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Your Review (Optional)
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Share your experience with this recipe..."
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-right">
                    {comment.length}/500
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-400">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {loading ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update Review" : "Submit Review")}
            </button>
        </form>
    )
}
