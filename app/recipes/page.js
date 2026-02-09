import { getRecipes } from "@/lib/actions/recipe"
import RecipeCard from "./components/RecipeCard"
import RecipeFilters from "./components/RecipeFilters"
import Link from "next/link"

function buildQueryString(params) {
    const query = new URLSearchParams()
    if (params.difficulty) query.set('difficulty', params.difficulty)
    if (params.cuisine) query.set('cuisine', params.cuisine)
    if (params.search) query.set('search', params.search)
    if (params.sortBy && params.sortBy !== 'recent') query.set('sortBy', params.sortBy)
    if (params.category) query.set('category', params.category)
    if (params.tag) query.set('tag', params.tag)
    const queryString = query.toString()
    return queryString ? `&${queryString}` : ''
}

export default async function RecipePage({ searchParams }) {
    const params = await searchParams
    const page = parseInt(params.page) || 1
    const difficulty = params.difficulty || undefined
    const cuisine = params.cuisine || undefined
    const search = params.search || undefined
    const sortBy = params.sortBy || 'recent'
    const category = params.category || undefined
    const tag = params.tag || undefined

    const { recipes, pagination } = await getRecipes({ page, difficulty, cuisine, search, sortBy, category, tag })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                            Browse Recipes
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                            Discover delicious recipes from our community
                            {recipes.length > 0 && ` · ${pagination.total} ${pagination.total === 1 ? 'recipe' : 'recipes'} found`}
                        </p>
                    </div>
                    <Link
                        href="/recipes/create"
                        className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold"
                    >
                        + Create Recipe
                    </Link>
                </div>

                <RecipeFilters />

                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                            No recipes found. Be the first to create one!
                        </p>
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {pagination.page > 1 && (
                            <Link
                                href={`/recipes?page=${pagination.page - 1}${buildQueryString({ difficulty, cuisine, search, sortBy, category, tag })}`}
                                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700"
                            >
                                Previous
                            </Link>
                        )}

                        <span className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        {pagination.page < pagination.totalPages && (
                            <Link
                                href={`/recipes?page=${pagination.page + 1}${buildQueryString({ difficulty, cuisine, search, sortBy, category, tag })}`}
                                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
