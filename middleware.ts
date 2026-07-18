// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Routes yang tidak perlu login
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Jika sudah login dan mengakses /login, redirect ke home
    const session = request.cookies.get('session')?.value;
    if (session) {
      try {
        await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        // Session invalid, biarkan akses login
      }
    }
    return NextResponse.next();
  }

  // Cek session untuk protected routes
  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    return NextResponse.next();
  } catch {
    // Session invalid, redirect ke login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
