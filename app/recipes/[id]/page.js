import { getRecipe } from "@/lib/actions/recipe"
import { getReviewsForRecipe, getUserReviewForRecipe } from "@/lib/actions/review"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import DeleteRecipeButton from "../components/DeleteRecipeButton"
import RecipeDetails from "../components/RecipeDetails"
import StarRating from "@/app/ratings/components/StarRating"
import ReviewStats from "@/app/ratings/components/ReviewStats"
import ReviewForm from "@/app/ratings/components/ReviewForm"
import ReviewList from "@/app/ratings/components/ReviewList"

export default async function RecipeDetailPage({ params }) {
    const { id } = await params
    const session = await auth()
    const recipe = await getRecipe(id)

    if (!recipe) {
        notFound()
    }

    const isOwner = session?.user?.id === recipe.authorId

    const { reviews } = await getReviewsForRecipe(id, { sortBy: 'newest', limit: 100 })
    const userReview = await getUserReviewForRecipe(id)

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link 
                    href="/recipes" 
                    className="inline-flex items-center text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 font-medium"
                >
                    <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
                    Back to Recipes
                </Link>

                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden mb-6">
                    {recipe.image && (
                        <div className="relative w-full h-96">
                            <Image
                                src={recipe.image}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {recipe.title}
                                </h1>
                                
                                <div className="flex items-center gap-3 mb-3">
                                    <StarRating rating={recipe.averageRating} readonly size="md" />
                                    <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                                        {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings yet'}
                                    </span>
                                    {recipe._count.reviews > 0 && (
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            ({recipe._count.reviews} {recipe._count.reviews === 1 ? 'review' : 'reviews'})
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        {recipe.author.image ? (
                                            <Image
                                                src={recipe.author.image}
                                                alt={recipe.author.name}
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                                        )}
                                        <span>By {recipe.author.name}</span>
                                    </div>
                                    <span>•</span>
                                    <span>
                                        {new Date(recipe.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-2 flex-shrink-0">
                                    <Link
                                        href={`/recipes/${recipe.id}/edit`}
                                        className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteRecipeButton recipeId={recipe.id} />
                                </div>
                            )}
                        </div>

                        <p className="text-zinc-700 dark:text-zinc-300 mb-6">{recipe.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm border-t border-b border-zinc-200 dark:border-zinc-700 py-4">
                            <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Prep Time:</span>
                                <span className="ml-2 font-semibold text-zinc-900 dark:text-white">{recipe.prepTime} min</span>
                            </div>
                            <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Cook Time:</span>
                                <span className="ml-2 font-semibold text-zinc-900 dark:text-white">{recipe.cookTime} min</span>
                            </div>
                            <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Difficulty:</span>
                                <span className="ml-2 font-semibold capitalize text-zinc-900 dark:text-white">
                                    {recipe.difficulty}
                                </span>
                            </div>
                            <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Favorites:</span>
                                <span className="ml-2 font-semibold text-zinc-900 dark:text-white">
                                    {recipe._count.favorites}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <RecipeDetails recipe={recipe} />

                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Ratings & Reviews
                    </h2>

                    <ReviewStats reviews={reviews} averageRating={recipe.averageRating} />

                    {session?.user && !userReview && !isOwner && (
                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                                Write a Review
                            </h3>
                            <ReviewForm recipeId={recipe.id} />
                        </div>
                    )}

                    {session?.user && userReview && (
                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                                Your Review
                            </h3>
                            <ReviewForm recipeId={recipe.id} existingReview={userReview} />
                        </div>
                    )}

                    {session?.user && isOwner && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                You cannot review your own recipe.
                            </p>
                        </div>
                    )}

                    {!session?.user && reviews.length > 0 && (
                        <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                <Link href="/login" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">
                                    Log in
                                </Link>
                                {' '}to leave a review
                            </p>
                        </div>
                    )}

                    <ReviewList 
                        initialReviews={reviews} 
                        currentUserId={session?.user?.id} 
                        recipeId={recipe.id} 
                    />
                </div>
            </div>
        </div>
    )
}
