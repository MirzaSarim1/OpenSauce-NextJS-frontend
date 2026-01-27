"use client"

import { register } from "@/lib/actions/auth"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const router = useRouter()

  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required"
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters"
        }
        break

      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "password":
        if (!value) {
          error = "Password is required"
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Must contain at least one lowercase letter"
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Must contain at least one uppercase letter"
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Must contain at least one number"
        }
        break

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password"
        } else if (value !== formData.password) {
          error = "Passwords do not match"
        }
        break

      default:
        break
    }

    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }

    const error = validateField(name, value)
    if (error && value.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }))

    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword)
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const errors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) errors[key] = error
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("email", formData.email)
    submitData.append("password", formData.password)
    submitData.append("confirmPassword", formData.confirmPassword)

    try {
      const result = await register(submitData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        router.push(`/verify-email?userId=${result.userId}&email=${encodeURIComponent(result.email)}`)
      }
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 py-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 dark:bg-zinc-800 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
            Join Open Sauce
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Create your account to start sharing recipes
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400">⚠️</span>
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`block w-full rounded-md border px-3 py-2.5 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${fieldErrors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-300 focus:border-orange-500 focus:ring-orange-500/20"
                }`}
              placeholder="Saram Khalil"
            />
            {fieldErrors.name && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>•</span> {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`block w-full rounded-md border px-3 py-2.5 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${fieldErrors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-300 focus:border-orange-500 focus:ring-orange-500/20"
                }`}
              placeholder="saram@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>•</span> {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`block w-full rounded-md border px-3 py-2.5 pr-10 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${fieldErrors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-zinc-300 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>•</span> {fieldErrors.password}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                8+ characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`block w-full rounded-md border px-3 py-2.5 pr-10 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${fieldErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-zinc-300 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>•</span> {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 dark:text-white hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
