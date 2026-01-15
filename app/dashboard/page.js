import { auth } from "@/lib/auth"
import { logout } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4 py-8">
      <div className="mb-8 flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Welcome, {session.user.name}!
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Email: {session.user.email}</p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Role: {session.user.role}</p>

        <div className="mt-6 flex gap-4">
          <Link
            href="/recipes/create"
            className="rounded-md bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
          >
            Create Recipe
          </Link>
          <Link
            href="/profile"
            className="rounded-md border border-zinc-300 px-6 py-2 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
