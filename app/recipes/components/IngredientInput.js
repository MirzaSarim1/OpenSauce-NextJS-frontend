"use client"

import { useState } from "react"

export default function IngredientInput({ initialIngredients = [] }) {
  const [ingredients, setIngredients] = useState(
    initialIngredients.length > 0 
      ? initialIngredients 
      : [{ name: "", quantity: "", unit: "" }]
  )

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Ingredients *
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 cursor-pointer"
        >
          + Add Ingredient
        </button>
      </div>

      <input 
        type="hidden" 
        name="ingredients" 
        value={JSON.stringify(ingredients.filter(ing => ing.name.trim()))}
      />

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                required={index === 0}
              />
            </div>

            <div className="w-24">
              <input
                type="text"
                placeholder="Qty"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                required={index === 0}
              />
            </div>

            <div className="w-24">
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
              className="h-10 w-10 rounded-lg border border-zinc-300 text-zinc-500 hover:border-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-zinc-600"
              title="Remove ingredient"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Click "Add Ingredient" to start adding ingredients
        </p>
      )}
    </div>
  )
}