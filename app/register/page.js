"use client"

import { register } from "@/lib/actions/auth"
import Link from "next/link"
import React, { useState } from "react"

export default function RegisterPage() {
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const result = await register(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("Something went wrong")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 dark:bg-zinc-800">
        <div>
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
            Join Open Sauce
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
              placeholder="Sarim Khalil"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
              placeholder="example@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:bg-zinc-700 dark:text-white"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:text-white cursor-pointer"
          >
            Create account
          </button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 dark:text-white">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
