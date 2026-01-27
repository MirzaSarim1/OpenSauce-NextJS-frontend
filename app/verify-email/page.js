"use client"

import { verifyEmail, resendVerificationCode } from "@/lib/actions/auth"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const userId = searchParams.get("userId")
  const email = searchParams.get("email")

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!userId || !email) {
      router.push("/register")
    }
  }, [userId, email, router])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)

    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const lastIndex = Math.min(pastedData.length, 5)
    document.getElementById(`otp-${lastIndex}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits")
      setLoading(false)
      return
    }

    try {
      const result = await verifyEmail(userId, otpCode)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        setSuccess("Email verified successfully! Logging you in...")
        
        await signIn("credentials", {
          email: email,
          redirect: false,
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setSuccess(null)
    setResending(true)

    try {
      const result = await resendVerificationCode(userId)

      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess("Verification code resent! Check your email.")
        setOtp(["", "", "", "", "", ""])
        document.getElementById("otp-0")?.focus()
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setResending(false)
    }
  }

  if (!userId || !email) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 dark:bg-zinc-800">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            We've sent a 6-digit code to
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
            {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full rounded-md bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending || loading}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/register")}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <i className="fa fa-arrow-left px-2" aria-hidden="true"></i>
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}