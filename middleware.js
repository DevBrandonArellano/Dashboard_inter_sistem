import { NextResponse } from 'next/server';

/**
 * Middleware de Next.js para proteger rutas del dashboard.
 * Verifica que exista la cookie de sesión antes de permitir acceso.
 */
export function middleware(request) {
  const sessionCookie = request.cookies.get('sebdom_b_session');
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/api/auth', '/api/health', '/api/inventory-report'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (isPublic) {
    return NextResponse.next();
  }

  // Si no hay sesión y la ruta es protegida, redirigir a login
  if (!sessionCookie && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
