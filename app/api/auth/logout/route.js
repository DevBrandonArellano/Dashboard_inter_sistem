import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearSessionCookies, ID_TOKEN_COOKIE } from '@/lib/auth';
import { buildLogoutUrl } from '@/lib/keycloak';

/**
 * GET /api/auth/logout
 * Limpia cookies de sesión y redirige al logout de Keycloak.
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(ID_TOKEN_COOKIE)?.value;

  await clearSessionCookies();

  const origin = new URL(request.url).origin;
  const logoutUrl = buildLogoutUrl(`${origin}/login`, idToken);

  return NextResponse.redirect(logoutUrl);
}
