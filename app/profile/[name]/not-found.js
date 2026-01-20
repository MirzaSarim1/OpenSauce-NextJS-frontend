import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Profile Not Found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The user profile you're looking for doesn't exist.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-md bg-orange-600 px-6 py-2 font-medium text-white hover:bg-orange-700"
          >
            Go Home
          </Link>
          <Link
            href="/recipes"
            className="rounded-md border border-zinc-300 px-6 py-2 font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
