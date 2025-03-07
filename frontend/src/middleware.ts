import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; //CSS Routing
// import { jwtVerify } from 'jose';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isHomePage = request.nextUrl.pathname === '/';

  // ถ้าเข้าหน้า login แต่มี token อยู่แล้ว ให้ redirect ไป dashboard
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ถ้าเข้าหน้าหลักและมี token ให้ไป dashboard
  if (isHomePage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ถ้าไม่มี token และไม่ได้อยู่ในหน้า login ให้ redirect ไปหน้า login
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*']
};