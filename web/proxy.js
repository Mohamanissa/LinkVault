import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'linkvault_admin';
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Toutes les routes /admin/* SAUF /admin (le login) sont protégées
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch {
      // Token invalide ou expiré
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Si l'admin est déjà connecté et va sur /admin, rediriger vers le dashboard
  if (pathname === '/admin') {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } catch {
        // Token invalide → laisser la page login s'afficher
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
