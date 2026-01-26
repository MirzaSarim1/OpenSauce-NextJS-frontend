import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-background.jpg"
          alt="Cooking ingredients background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-lg">
          Welcome to <span className="text-orange-500">Open Sauce</span>
        </h1>
        
        <p className="mb-12 text-lg text-white/90 drop-shadow-md max-w-2xl">
          Discover, share, and save your favorite recipes with our community of food lovers
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/recipes"
                className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-zinc-900 shadow-lg transition-all backdrop-blur-sm"
              >
                Browse Recipes
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-zinc-900 shadow-lg transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
