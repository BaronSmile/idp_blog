import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromHeader } from './lib/jwt';

const publicPaths = [
  '/',
  '/login',
  '/register',
  '/reset',
  '/api/auth/login',
  '/api/auth/register',
];

const adminPaths = [
  '/admin',
  '/api/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader ? getTokenFromHeader(authHeader) : null;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (adminPaths.some(path => pathname.startsWith(path)) && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 