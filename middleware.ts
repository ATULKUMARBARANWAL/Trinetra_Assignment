import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuth = !!token
  const { pathname } = request.nextUrl

  // NOTE:
  // Auth state is managed client-side (Redux + localStorage) in this app.
  // Cookie may not always be present across all deploy environments,
  // so do not force /dashboard -> /login here to avoid redirect loops.
  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}
