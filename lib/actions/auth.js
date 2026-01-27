"use server"

import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function login(formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Please provide both email and password" }
  }

  try {
    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid email or password" }
    }
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    return { error: "Something went wrong" }
  }
}

export async function register(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const name = formData.get("name")

  if (!email || !password || !confirmPassword || !name) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Password and Confirm Password do not match" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    return { error: "An account with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const { generateOTP, getOTPExpiry, sendVerificationEmail } = await import ("@/lib/email")

    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        emailVerified: false,
        verificationToken: otp,
        verificationTokenExpiry: otpExpiry,
      }
    })

    const emailResult = await sendVerificationEmail(email.toLowerCase(), name.trim(), otp)

    if (!emailResult.success) {
      await prisma.user.delete({ where: { id: user.id } })
      return { error: "Failed to send verification email. Please try again." }
    }

    return {
      success: true,
      userId: user.id,
      email: email.toLowerCase()
    }

  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}

export async function verifyEmail(userId, otp) {
  if (!userId || !otp) {
    return { error: "Invalid Verification Code" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpiry: true,
      }
    })

    if (!user) {
      return { error: "User Not Found" }
    }

    if (user.emailVerified) {
      return { error: "Email is already verified" }
    }

    if (!user.verificationToken || !user.verificationTokenExpiry) {
      return { error: "No verification code found. Please request a new one" }
    }

    if (new Date() > user.verificationTokenExpiry) {
      return { error: "verification code has expired. Please request a new one" }
    }

    if (user.verificationToken !== otp.trim()) {
      return { error: "invalid verification code" }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      }
    })

    return { success: true, email: user.email }
  } catch (error) {
    console.error("Verification error:", error)
    return { error: "Failed to verify email. Please try again." }
  }
}

export async function resendVerificationCode(userId) {
  if (!userId) {
    return { error: "Invalid user ID" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      }
    })

    if (!user) {
      return { error: "User not found" }
    }

    if (user.emailVerified) {
      return { error: "Email is already verified" }
    }

    const { generateOTP, getOTPExpiry, sendVerificationEmail } = await import ("@/lib/email")

    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: otp,
        verificationTokenExpiry: otpExpiry,
      }
    })

    const emailResult = await sendVerificationEmail(user.email, user.name, otp)

    if (!emailResult.success) {
      return { error: "Failed to send verification email. Please try again." }
    }

    return { success: true }

  } catch (error) {
    console.error("Resend OTP error:", error)
    return { error: "Failed to resend verification code. Please try again." }
  }
}

export async function logout() {
  await signOut({ redirect: false })
  redirect("/")
}