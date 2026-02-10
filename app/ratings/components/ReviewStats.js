import StarRating from "./StarRating"

export default function ReviewStats({ reviews, averageRating }) {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    
    reviews.forEach(review => {
        if (ratingCounts[review.rating] !== undefined) {
            ratingCounts[review.rating]++
        }
    })

    const totalReviews = reviews.length

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center justify-center md:border-r md:border-zinc-200 dark:md:border-zinc-700 md:pr-8">
                    <div className="text-5xl font-bold text-zinc-900 dark:text-white mb-2">
                        {totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <StarRating rating={averageRating} readonly size="lg" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingCounts[rating]
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 min-w-[60px]">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {rating}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                
                                <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                
                                <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[40px] text-right">
                                    {count}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
