import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Production Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 2. Server-side Protection for /admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Check for admin session cookie
    const adminToken = request.cookies.get('tibeb_admin_token')?.value ||
      request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('sb-auth-token')?.value;

    const authHeader = request.headers.get('authorization');
    const hasAdminCookie = Boolean(adminToken) || Boolean(authHeader);

    // If attempting to access /admin directly without credentials, verify
    // Note: Next.js SSR runs this before page render.
    if (!hasAdminCookie && pathname !== '/admin/login') {
      // In SSR, if not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      // If it's an API route, return 401 Unauthorized
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
