import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold">
          Welcome to <span className="text-orange-600">Open Sauce</span>
        </h1>
        
        <p className="mb-12 text-lg">
          Discover, share, and save your favorite recipes
        </p>

        <div className="flex flex-col gap-4 flex-row">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full bg-orange-600 px-8 py-3 font-medium text-white hover:bg-orange-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/recipes"
                className="rounded-full border-2 px-8 py-3 font-medium hover:bg-zinc-900 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-zinc-900"
              >
                Browse Recipes
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-orange-600 px-8 py-3 font-medium text-white hover:bg-orange-700"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border-2 border-zinc-900 px-8 py-3 font-medium hover:bg-zinc-900 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-zinc-900"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
