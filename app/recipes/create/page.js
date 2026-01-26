import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import RecipeForm from "../components/RecipeForm"

export default async function CreateRecipePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link 
          href="/dashboard"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-8 inline-block"
        >
          <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create New Recipe
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Share your culinary creation with the world
          </p>
        </div>

        <div className="rounded-xl bg-white shadow-lg dark:bg-zinc-800 p-6">
          <RecipeForm />
        </div>
      </div>
    </div>
  )
}