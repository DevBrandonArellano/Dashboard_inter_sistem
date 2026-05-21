import { cookies } from 'next/headers';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { keycloakConfig } from './keycloak';

/**
 * Utilidades de autenticación para API Routes y Server Components de Sistema B.
 */

let _jwks = null;
function getJWKS() {
  if (!_jwks) {
    _jwks = createRemoteJWKSet(new URL(keycloakConfig.endpoints.jwks));
  }
  return _jwks;
}

/** Nombre de la cookie donde almacenamos el access token */
export const SESSION_COOKIE = 'sebdom_b_session';
export const REFRESH_COOKIE = 'sebdom_b_refresh';
export const ID_TOKEN_COOKIE = 'sebdom_b_id_token';

/**
 * Obtiene y valida la sesión del usuario desde la cookie.
 * @returns {Promise<{ authenticated: boolean, user?: object }>}
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return { authenticated: false };
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: keycloakConfig.realmUrl,
    });

    const realmRoles = payload.realm_access?.roles || [];
    let role = 'operador';
    if (realmRoles.includes('admin')) role = 'admin';

    return {
      authenticated: true,
      user: {
        id: payload.sub,
        email: payload.email || payload.preferred_username,
        name: payload.name || payload.preferred_username || '',
        role,
        roles: realmRoles,
      },
    };
  } catch (err) {
    console.error('Session validation failed:', err.message);
    return { authenticated: false };
  }
}

/**
 * Establece las cookies de sesión después del login.
 * @param {object} tokens - { access_token, refresh_token, id_token, expires_in }
 */
export async function setSessionCookies(tokens) {
  const cookieStore = await cookies();
  const maxAge = tokens.expires_in || 300;

  cookieStore.set(SESSION_COOKIE, tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  if (tokens.refresh_token) {
    cookieStore.set(REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }

  if (tokens.id_token) {
    cookieStore.set(ID_TOKEN_COOKIE, tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  }
}

/**
 * Limpia las cookies de sesión.
 */
export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(ID_TOKEN_COOKIE);
}
