import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies.
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // And update the response cookies.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies.
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          // And update the response cookies.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - important for server components
  // Using getUser instead of getSession helps refresh tokens automatically
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes logic
  // Define protected paths
  const protectedPaths = [
    "/", 
    "/search",
    "/inbox",
    "/assigned-to-me",
    "/created-by-me",
    "/private-tasks",
    "/team",
    "/settings",
    "/profile-options",
    "/projects",
    "/projects/",
    "/to-triage",
    "/backlog",
    "/active",
    "/workspace",
    "/new"
  ];

  // Check if the current path is protected and there is no user
  if (!user && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // Redirect to sign-in page
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname) // Optional: inform sign-in page where user came from
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  const authPaths = ["/auth/signin", "/auth/signup"];
  if (user && authPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth routes themselves to avoid loops) - IMPORTANT
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
