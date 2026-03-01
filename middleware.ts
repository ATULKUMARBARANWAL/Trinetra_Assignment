import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuth = !!token
  const { pathname } = request.nextUrl

  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isAuth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}