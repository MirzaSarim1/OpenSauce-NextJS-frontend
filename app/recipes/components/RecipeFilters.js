"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"

export default function RecipeFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const difficulty = searchParams.get('difficulty') || ''
    const sortBy = searchParams.get('sortBy') || 'recent'

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        params.delete('page')

        router.push(`/recipes?${params.toString()}`)
    }

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mr-2">
                        Difficulty:
                    </label>
                    <select
                        className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm cursor-pointer"
                        value={difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mr-2">
                        Sort By:
                    </label>
                    <select
                        className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm cursor-pointer"
                        value={sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>
        </div>
    )
}