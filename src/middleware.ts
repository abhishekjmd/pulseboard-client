import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/signup"];
const protectedRoutePrefixes = ["/dashboard", "/workspaces"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("pb_auth")?.value === "1";

  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutePrefixes.some(prefix => pathname.startsWith(prefix));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/workspaces/:path*",
    "/repos/:path*",
    "/login",
    "/signup"
  ],
};
