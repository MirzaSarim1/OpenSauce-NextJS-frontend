"use client"

import { useState } from "react"
import ReviewCard from "./ReviewCard"

export default function ReviewList({ initialReviews, currentUserId, recipeId }) {
    const [sortBy, setSortBy] = useState('newest')
    const [reviews, setReviews] = useState(initialReviews)

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy)
        
        const sorted = [...reviews].sort((a, b) => {
            switch (newSortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case 'highest':
                    return b.rating - a.rating
                case 'lowest':
                    return a.rating - b.rating
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt)
            }
        })
        
        setReviews(sorted)
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">
                    No reviews yet. Be the first to review this recipe!
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h3>
                
                <div className="flex items-center gap-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">
                        Sort by:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        currentUserId={currentUserId}
                        recipeId={recipeId}
                    />
                ))}
            </div>
        </div>
    )
}
