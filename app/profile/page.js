import { auth } from "@/lib/auth"
import { logout } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
        _count:{
            select: {
                recipes: true,
                favorites:  true,
                reviews: true,
                following: true,
                followedBy: true,
            }
        }
    }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
            Back to Dashboard
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white shadow-lg dark:bg-zinc-800 overflow-hidden">
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

              <Link
                href="/profile/edit"
                className="rounded-md bg-white px-6 py-2 font-medium text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Edit Profile
              </Link>
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

          <div className="border-t border-zinc-200 px-6 py-6 dark:border-zinc-700">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Member since:</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Last updated:</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/recipes/create"
            className="rounded-lg border-2 border-zinc-200 bg-white p-4 text-center transition-colors hover:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-2">
              <i className="fa-solid fa-pen-to-square text-2xl text-orange-500"></i>
            </div>
            <div className="font-medium text-zinc-900 dark:text-white">Create Recipe</div>
          </Link>
          <Link
            href="/favorites"
            className="rounded-lg border-2 border-zinc-200 bg-white p-4 text-center transition-colors hover:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-2">
              <i className="fa-solid fa-star text-2xl text-yellow-500"></i>
            </div>
            <div className="font-medium text-zinc-900 dark:text-white">My Favorites</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
