import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function PublicProfilePage({ params }) {
  const { name } = await params
  const session = await auth()

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: decodeURIComponent(name),
        mode: 'insensitive'
      }
    },
    include: {
      _count: {
        select: {
          recipes: true,
          favorites: true,
          reviews: true,
          following: true,
          followedBy: true,
        }
      },
      recipes: {
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              reviews: true,
              favorites: true,
            }
          }
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
            Back to Home
          </Link>
          {isOwnProfile && (
            <Link
              href="/profile"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
            >
              View My Profile
            </Link>
          )}
        </div>

        <div className="rounded-lg bg-white shadow-lg dark:bg-zinc-800 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-orange-600">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="mt-1 text-orange-100">
                  {user.email}
                </p>
                <div className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          {user.bio && (
            <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-700">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                About
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                {user.bio}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user._count.recipes}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Recipes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user._count.favorites}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Favorites
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user._count.reviews}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user._count.followedBy}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user._count.following}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Following
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Recent Recipes
            </h2>
            {user.recipes.length > 0 && (
              <Link
                href={`/recipes?author=${user.id}`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View All →
              </Link>
            )}
          </div>

          {user.recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                {isOwnProfile ? "You haven't posted any recipes yet." : `${user.name} hasn't posted any recipes yet.`}
              </p>
              {isOwnProfile && (
                <Link
                  href="/recipes/create"
                  className="mt-4 inline-block rounded-md bg-orange-600 px-6 py-2 text-white hover:bg-orange-700"
                >
                  Create Your First Recipe
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {user.recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group overflow-hidden rounded-lg border border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-700"
                >
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-6xl">🍳</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                      <span>💬 {recipe._count.reviews}</span>
                      <span>❤️ {recipe._count.favorites}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}