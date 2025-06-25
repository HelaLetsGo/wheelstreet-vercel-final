import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } })
  const pathname = req.nextUrl.pathname

  // Check if the path starts with /admin and isn't the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    try {
      // Create a Supabase client configured to use cookies
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return req.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              req.cookies.set({ name, value, ...options })
              res = NextResponse.next({ request: { headers: req.headers } })
              res.cookies.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              req.cookies.set({ name, value: "", ...options })
              res = NextResponse.next({ request: { headers: req.headers } })
              res.cookies.set({ name, value: "", ...options })
            },
          },
        }
      )

      // Get the session
      const { data: { session }, error } = await supabase.auth.getSession()

      // If error or no session, redirect to login
      if (error || !session) {
        console.log("No valid session found, redirecting to login")
        const url = new URL("/admin/login", req.url)
        url.searchParams.set("from", pathname)
        return NextResponse.redirect(url)
      }

      // User is authenticated, continue
      return res
    } catch (error) {
      console.error("Middleware error:", error)
      // On error, redirect to login
      const url = new URL("/admin/login", req.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  return res
}

// Only run the middleware on admin pages
export const config = {
  matcher: "/admin/:path*",
}
