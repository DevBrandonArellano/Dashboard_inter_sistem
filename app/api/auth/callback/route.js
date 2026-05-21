import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/keycloak';
import { setSessionCookies } from '@/lib/auth';

/**
 * GET /api/auth/callback?code=xxx
 * Keycloak redirige aquí con el authorization code.
 * Intercambiamos por tokens, los guardamos en cookies httpOnly,
 * y redirigimos al dashboard.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    const desc = searchParams.get('error_description') || error;
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(desc)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=No+se+recibió+el+código', request.url)
    );
  }

  try {
    const redirectUri = `${new URL(request.url).origin}/api/auth/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Guardar tokens en cookies httpOnly seguras
    await setSessionCookies(tokens);

    // Redirigir al dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Auth callback error:', err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message)}`, request.url)
    );
  }
}
