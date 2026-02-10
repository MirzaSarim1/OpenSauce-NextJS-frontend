import { auth } from "@/lib/auth"
import { getUserFavorites } from "@/lib/actions/favorite"
import { redirect } from "next/navigation"
import RecipeCard from "../recipes/components/RecipeCard"
import Link from "next/link"

export default async function FavoritesPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const { recipes } = await getUserFavorites(session.user.id)

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

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        My Favorites
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                        {recipes.length > 0 
                            ? `You have ${recipes.length} favorite ${recipes.length === 1 ? 'recipe' : 'recipes'}`
                            : 'No favorites yet'
                        }
                    </p>
                </div>

                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 border border-zinc-200 dark:border-zinc-700 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-heart text-white text-4xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                No Favorites Yet
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                Start exploring recipes and save your favorites!
                            </p>
                            <Link
                                href="/recipes"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg hover:from-orange-600 hover:to-orange-500 font-semibold transition-all"
                            >
                                <i className="fa-solid fa-search"></i>
                                Browse Recipes
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}