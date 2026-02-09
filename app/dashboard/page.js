import { auth } from "@/lib/auth"
import { logout } from "@/lib/actions/auth"
import { getDashboardData } from "@/lib/actions/dashboard"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const dashboardData = await getDashboardData()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4 py-8">
      <div className="mb-8 flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Welcome back, {session.user.name}!
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">My Recipes</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                  {dashboardData?.recipesCount || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <i className="fa-solid fa-book text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Favorites</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                  {dashboardData?.totalFavorites || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <i className="fa-solid fa-heart text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Reviews</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                  {dashboardData?.totalReviews || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <i className="fa-solid fa-comment text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">My Favorites</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                  {dashboardData?.favoritedRecipesCount || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <i className="fa-solid fa-bookmark text-white text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/recipes/create"
              className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all"
            >
              <i className="fa-solid fa-plus text-xl"></i>
              <span className="font-semibold">Create Recipe</span>
            </Link>
            <Link
              href="/recipes"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
            >
              <i className="fa-solid fa-search text-xl text-zinc-700 dark:text-zinc-300"></i>
              <span className="font-semibold text-zinc-900 dark:text-white">Browse Recipes</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
            >
              <i className="fa-solid fa-user text-xl text-zinc-700 dark:text-zinc-300"></i>
              <span className="font-semibold text-zinc-900 dark:text-white">View Profile</span>
            </Link>
          </div>
        </div>

        {dashboardData?.recentRecipes && dashboardData.recentRecipes.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Your Recent Recipes
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recentRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all">
                    <div className="relative w-full h-48 bg-zinc-200 dark:bg-zinc-700">
                      {recipe.image ? (
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2 mb-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <i className="fa-solid fa-heart text-red-500"></i>
                          <span>{recipe._count.favorites}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="fa-solid fa-comment"></i>
                          <span>{recipe._count.reviews}</span>
                        </div>
                        <span className="capitalize">{recipe.difficulty.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!dashboardData?.recentRecipes || dashboardData.recentRecipes.length === 0) && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 border border-zinc-200 dark:border-zinc-700 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-book text-white text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                No Recipes Yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Start sharing your culinary creations with the community!
              </p>
              <Link
                href="/recipes/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 font-semibold transition-all"
              >
                <i className="fa-solid fa-plus"></i>
                Create Your First Recipe
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
