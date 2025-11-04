import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('🛡️ Middleware:', request.nextUrl.pathname, 'User:', user?.email || 'None')

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      console.log('🛡️ Redirecting to login - no user')
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect wizard routes
  const protectedWizardRoutes = ['/customer-wizard', '/floor-selection', '/measurements', '/estimate']
  if (protectedWizardRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      console.log('🛡️ Redirecting to login - protected route, no user')
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect to dashboard if logged in and trying to access login
  if (request.nextUrl.pathname === '/login' && user) {
    console.log('🛡️ Redirecting to dashboard - user logged in')
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customer-wizard/:path*',
    '/floor-selection/:path*',
    '/measurements/:path*',
    '/estimate/:path*',
    '/login',
  ],
}
