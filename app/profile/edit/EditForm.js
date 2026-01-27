"use client"

import { useState, useRef } from "react"
import { updateProfile } from "@/lib/actions/profile"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function EditForm({ user }) {
  const [imagePreview, setImagePreview] = useState(user?.image || null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
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

    setImageRemoved(false)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageRemoved(true)
    setErrors(prev => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess(false)
    setLoading(true)

    const formData = new FormData(e.target)

    try {
      const result = await updateProfile(formData)
      if (result?.error) {
        setErrors({ form: result.error })
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/profile"), 1500)
      }
    } catch (err) {
      setErrors({ form: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Link 
        href="/profile"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-8 inline-block"
      >
        <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
        Back to Profile
      </Link>

      <div className="rounded-xl bg-white shadow-lg dark:bg-zinc-800">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Update your profile information and photo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <input type="hidden" name="removeImage" value={imageRemoved ? "true" : "false"} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-pink-500">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 text-white 
                  hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg cursor-pointer"
                  title="Remove image"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex flex-col items-center space-y-2">
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
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 
                dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
              >
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </button>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                JPG, PNG or WebP. Max 5MB.
              </p>
              {errors.image && (
                <p className="text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Display Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user?.name || ""}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label 
              htmlFor="bio" 
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={user?.bio || ""}
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Write a short bio about yourself (optional)
            </p>
          </div>

          {errors.form && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {errors.form}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
              Profile updated! Redirecting...
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white transition-all 
              hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/profile"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-center font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}