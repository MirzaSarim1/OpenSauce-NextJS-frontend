"use client"

import { useState } from "react"
import { updateProfile } from "@/lib/actions/profile"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditForm({ user }) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)

    try {
      const result = await updateProfile(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/profile"), 1500)
      }
    } catch (err) {
      setError("Something went wrong")
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

      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          Edit Profile
        </h1>

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">Profile updated! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={user.name}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={user.bio || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Profile Image URL
            </label>
            <input
              name="image"
              type="url"
              defaultValue={user.image || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/profile"
              className="rounded-md border border-zinc-300 px-6 py-2 text-center hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}