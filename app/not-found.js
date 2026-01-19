import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="text-center">
        <div className="mb-8 text-8xl"></div>
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Page Not Found
        </h2>
        <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-md bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/recipes"
            className="rounded-md border-2 border-orange-600 px-6 py-3 font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
