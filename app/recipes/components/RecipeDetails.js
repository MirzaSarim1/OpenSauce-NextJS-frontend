"use client"

import { useState } from "react"

export default function RecipeDetails({ recipe }) {
    const [showIngredients, setShowIngredients] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)

    return (
        <>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="flex-1 px-6 py-3 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 
                    dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors cursor-pointer"
                >
                    {showIngredients ? "Hide" : "Show"} Ingredients
                </button>
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex-1 px-6 py-3 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 
                    dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors cursor-pointer"
                >
                    {showInstructions ? "Hide" : "Show"} Instructions
                </button>
            </div>

            {showIngredients && (
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ingredients</h2>
                    <div className="space-y-3">
                        {recipe.ingredients.map((recipeIngredient) => (
                            <div key={recipeIngredient.id} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                                <span className="text-zinc-900 dark:text-white font-bold mt-0.5">•</span>
                                <div className="flex-1">
                                    <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                                        {recipeIngredient.ingredient.name}
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            <span className="font-medium">Quantity:</span>{" "}
                                            <span className="text-zinc-900 dark:text-white">{recipeIngredient.quantity}</span>
                                        </span>
                                        {recipeIngredient.unit && (
                                            <span className="text-zinc-600 dark:text-zinc-400">
                                                <span className="font-medium">Unit:</span>{" "}
                                                <span className="text-zinc-900 dark:text-white">{recipeIngredient.unit}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Instructions</h2>
                    <div className="prose max-w-none">
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                            {recipe.instructions}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
