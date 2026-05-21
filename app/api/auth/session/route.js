import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/session
 * Retorna la información de la sesión actual del usuario.
 */
export async function GET() {
  const session = await getSession();

  if (!session.authenticated) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}
