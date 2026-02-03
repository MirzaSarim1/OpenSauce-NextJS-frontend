import Image from "next/image"
import Link from "next/link"
import StarRating from "@/app/ratings/components/StarRating"

export default function RecipeCard({ recipe }) {
    return (
        <Link href={`/recipes/${recipe.id}`}>
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
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
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2">
                        {recipe.title}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {recipe.description}
                    </p>

                    {recipe.averageRating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                            <StarRating rating={recipe.averageRating} size="sm" readonly />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                {recipe.averageRating.toFixed(1)} ({recipe._count.reviews})
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {recipe.author.image ? (
                            <Image
                                src={recipe.author.image}
                                alt={recipe.author.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                        )}
                        <span>By {recipe.author.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700 pt-3">
                        <div className="flex gap-3">
                            <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                            <span className="capitalize">📊 {recipe.difficulty}</span>
                        </div>
                        <div className="flex gap-2">
                            <span>❤️ {recipe._count.favorites}</span>
                            <span>💬 {recipe._count.reviews}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
