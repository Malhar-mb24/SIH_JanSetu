import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',
  '/_next',
  '/_vercel',
  '/favicon.ico',
  '/unauthorized',
  '/error',
];

// List of admin paths that require admin role
const adminPaths = ['/admin', '/settings'];

// List of manager paths that require manager role
const managerPaths = ['/manager'];

// List of protected paths that require authentication but no specific role
const protectedPaths = [
  '/dashboard',
  '/my-work',
  '/issues',
  '/command-center',
  '/staff',
  '/analytics',
  '/profile'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If no token and trying to access protected path, redirect to login
  if (!token) {
    if (protectedPaths.some(path => pathname.startsWith(path)) ||
        adminPaths.some(path => pathname.startsWith(path)) ||
        managerPaths.some(path => pathname.startsWith(path))) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const userRole = token.role as string;

  // Check admin routes
  if (adminPaths.some(path => pathname.startsWith(path)) && 
      userRole !== 'admin' && 
      userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check manager routes
  if (managerPaths.some(path => pathname.startsWith(path)) && 
      userRole !== 'manager' && 
      userRole !== 'admin' && 
      userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // If user is authenticated but tries to access login/register, redirect to dashboard
  if (['/login', '/register', '/forgot-password'].includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
