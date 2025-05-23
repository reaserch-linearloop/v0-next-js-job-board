import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"
import { UserRole } from "@prisma/client"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public paths that don't require authentication
    const publicPaths = ["/", "/jobs", "/jobs/[id]", "/auth/signin", "/auth/signup"]
    if (publicPaths.some(p => path.match(new RegExp(`^${p.replace("[id]", ".*")}$`)))) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Role-based access control
    if (path.startsWith("/dashboard/provider")) {
      if (token.role !== UserRole.JOB_PROVIDER && token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/dashboard/seeker", req.url))
      }
    }

    if (path.startsWith("/dashboard/seeker")) {
      if (token.role !== UserRole.JOB_SEEKER && token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/dashboard/provider", req.url))
      }
    }

    if (path.startsWith("/admin")) {
      if (token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/jobs/:path*",
    "/auth/:path*",
  ],
} 