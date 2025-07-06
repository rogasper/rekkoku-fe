import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/cookies";

// Define protected routes that require authentication
const protectedRoutes = [
  "/settings",
  "/u/", // User profile pages
  // Add more protected routes as needed
];

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = ["/login", "/register"];

// Define admin-only routes
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get and decrypt session cookie
  const sessionCookie = request.cookies.get("session")?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const isAuthenticated = !!session?.userId;
  const isAdmin = session?.role === "ADMIN";

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is public (login/register)
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route requires admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to home
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admin users from admin routes
  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Redirect authenticated users from public routes to home
  if (isPublicRoute && isAuthenticated) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Check for session expiration
  if (isAuthenticated && session?.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= session.exp) {
      // Session expired, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
