import { NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Mot de passe incorrect' },
      { status: 401 }
    );
  }

  const token = await createAdminToken();

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });

  return response;
}
