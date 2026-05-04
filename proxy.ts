import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  const { pathname } = request.nextUrl

  // Paths that don't require authentication
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyJWT(token);
  
  if (!payload) {
    // Invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_token')
    return response
  }

  const userId = payload.userId;
  const role = payload.role;

  // Inject user info into headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', userId)
  requestHeaders.set('x-user-role', role)

  // Role-based route protection
  const roleRoutes = ['admin', 'doctor', 'nurse', 'pharmacist', 'patient']
  const targetRole = roleRoutes.find(r => pathname.startsWith(`/${r}`))

  if (targetRole && targetRole !== role) {
    // Redirect to their own dashboard if they try to access another role's route
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  // Special case for patient charts (accessible by doctors and nurses)
  if (pathname.startsWith('/patients') && !['doctor', 'nurse', 'admin'].includes(role)) {
     return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
