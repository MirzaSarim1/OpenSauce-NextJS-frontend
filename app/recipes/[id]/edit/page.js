import { auth } from "@/lib/auth"
import { getRecipe } from "@/lib/actions/recipe"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import RecipeForm from "../../components/RecipeForm"

export default async function EditRecipePage({ params }) {
    const { id } = await params
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const recipe = await getRecipe(id)

    if (!recipe) {
        notFound()
    }

    if (recipe.authorId !== session.user.id) {
        redirect(`/recipes/${id}`)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <div className="mx-auto max-w-3xl px-4 py-8">
                <Link 
                    href={`/recipes/${id}`}
                    className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-8 inline-block"
                >
                    <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
                    Back to Recipe
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Edit Recipe
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Update your recipe details
                    </p>
                </div>

                <div className="rounded-xl bg-white shadow-lg dark:bg-zinc-800 p-6">
                    <RecipeForm recipe={recipe} isEdit={true} />
                </div>
            </div>
        </div>
    )
}