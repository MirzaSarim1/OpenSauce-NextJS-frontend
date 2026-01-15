export { auth as proxy } from "@/lib/auth"

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile/:path*',
    '/recipes/create',
    '/recipes/:id/edit',
    '/favorites/:path*',
  ],
}