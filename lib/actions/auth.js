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
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    return { error: "Something went wrong" }
  }
  
  redirect("/dashboard")
}

export async function register(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    return { error: "An account with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
      }
    })
  } catch (error) {
    return { error: "Failed to create account" }
  }

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })
  } catch (error) {
    redirect("/login")
  }

  redirect("/dashboard")
}

export async function logout() {
  await signOut({ redirect: false })
  redirect("/")
}