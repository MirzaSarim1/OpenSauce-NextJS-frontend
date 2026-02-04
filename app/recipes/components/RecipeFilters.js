"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { CUISINES, CATEGORIES, TAGS } from "@/lib/constants"

export default function RecipeFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const difficulty = searchParams.get('difficulty') || ''
    const cuisine = searchParams.get('cuisine') || ''
    const sortBy = searchParams.get('sortBy') || 'recent'
    const category = searchParams.get('category') || ''
    const tag = searchParams.get('tag') || ''

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilterChange('search', search)
        }, 500) 

        return () => clearTimeout(timer)
    }, [search])

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

    const clearFilters = () => {
        setSearch('')
        router.push('/recipes')
    }

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 mb-8 space-y-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search recipes by name, ingredient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 pr-12 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gradient-to-r from-orange-500 to-pink-500 p-2 text-white pointer-events-none">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Difficulty
                    </label>
                    <select
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                        value={difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All Levels</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Cuisine
                    </label>
                    <select
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                        value={cuisine}
                        onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                    >
                        {CUISINES.map(({ value, label }) => (
                            <option key={value || 'all'} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Category
                    </label>
                    <select
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                        value={category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Tag
                    </label>
                    <select
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                        value={tag}
                        onChange={(e) => handleFilterChange('tag', e.target.value)}
                    >
                        <option value="">All Tags</option>
                        {TAGS.map(t => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Sort By
                    </label>
                    <select
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                        value={sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>

            {(search || difficulty || cuisine || category || tag) && (
                <div className="flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 
                        dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    )
}
