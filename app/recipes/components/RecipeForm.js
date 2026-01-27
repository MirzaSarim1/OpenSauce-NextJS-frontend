"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createRecipe, updateRecipe } from "@/lib/actions/recipe"
import IngredientInput from "./IngredientInput"

export default function RecipeForm({ recipe = null, isEdit = false }) {
  const [imagePreview, setImagePreview] = useState(recipe?.image || null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const router = useRouter()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrors(prev => ({ ...prev, image: "" }))

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Invalid image format. Use JPG, PNG, or WebP" }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    setErrors(prev => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const formData = new FormData(e.target)
    
    if (imageFile) {
      formData.set('image', imageFile)
    } else if (isEdit && !imageFile) {
      formData.delete('image')
    }

    try {
      const result = isEdit 
        ? await updateRecipe(recipe.id, formData)
        : await createRecipe(formData)
      
      if (result?.error) {
        setErrors({ form: result.error })
      } else if (result?.success) {
        router.push(`/recipes/${result.recipeId}`)
      }
    } catch (err) {
      setErrors({ form: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={recipe?.title || ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
          placeholder="e.g., Grandma's Chocolate Chip Cookies"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={recipe?.description || ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white resize-none"
          placeholder="Brief description of your recipe..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Recipe Image {isEdit && "(Upload new image to replace)"}
        </label>
        
        {imagePreview ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={imagePreview}
              alt="Recipe preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
            errors.image 
              ? "border-red-500 dark:border-red-500" 
              : "border-zinc-300 dark:border-zinc-600"
          }`}>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
            >
              Click to upload image
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        )}
        {errors.image && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.image}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="prepTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Prep Time (minutes) *
          </label>
          <input
            type="number"
            id="prepTime"
            name="prepTime"
            required
            min="1"
            defaultValue={recipe?.prepTime || ""}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="cookTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Cook Time (minutes) *
          </label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            required
            min="1"
            defaultValue={recipe?.cookTime || ""}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            defaultValue={recipe?.difficulty || "MEDIUM"}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-orange-500 
            focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white cursor-pointer"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <IngredientInput initialIngredients={recipe?.ingredients?.map(ri => ({
        name: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.unit || ""
      })) || []} />

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Instructions *
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={5}
          defaultValue={recipe?.instructions || ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white resize-none"
          placeholder="Step-by-step instructions...&#10;&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients...&#10;3. Add wet ingredients..."
        />
      </div>

      {errors.form && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {errors.form}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 font-semibold text-white 
          transition-all hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (isEdit ? "Updating Recipe..." : "Creating Recipe...") : (isEdit ? "Update Recipe" : "Create Recipe")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border border-zinc-300 font-semibold text-zinc-700 hover:bg-zinc-50 
          dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}