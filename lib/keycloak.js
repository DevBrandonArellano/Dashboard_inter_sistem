/**
 * Keycloak OIDC helper para Sistema B (Next.js).
 * Usado en las API routes del servidor.
 */

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'sebdom-integrador';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'sistema-b';
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || '';

const realmUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`;

export const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
  clientSecret: KEYCLOAK_CLIENT_SECRET,
  realmUrl,
  endpoints: {
    authorization: `${realmUrl}/protocol/openid-connect/auth`,
    token: `${realmUrl}/protocol/openid-connect/token`,
    userinfo: `${realmUrl}/protocol/openid-connect/userinfo`,
    logout: `${realmUrl}/protocol/openid-connect/logout`,
    jwks: `${realmUrl}/protocol/openid-connect/certs`,
  },
};

/**
 * Intercambia un authorization code por tokens.
 * @param {string} code
 * @param {string} redirectUri
 * @returns {Promise<object>} tokens { access_token, refresh_token, id_token, ... }
 */
export async function exchangeCodeForTokens(code, redirectUri) {
  const response = await fetch(keycloakConfig.endpoints.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${err}`);
  }

  return response.json();
}

/**
 * Renueva tokens usando refresh_token.
 * @param {string} refreshToken
 * @returns {Promise<object>}
 */
export async function refreshTokens(refreshToken) {
  const response = await fetch(keycloakConfig.endpoints.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Refresh token inválido o expirado');
  }

  return response.json();
}

/**
 * Construye la URL de autorización de Keycloak para el frontend.
 * @param {string} redirectUri
 * @returns {string}
 */
export function buildAuthorizationUrl(redirectUri) {
  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
  });
  return `${keycloakConfig.endpoints.authorization}?${params.toString()}`;
}

/**
 * Construye URL de logout de Keycloak.
 * @param {string} redirectUri
 * @param {string} [idTokenHint]
 * @returns {string}
 */
export function buildLogoutUrl(redirectUri, idTokenHint) {
  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    post_logout_redirect_uri: redirectUri,
  });
  if (idTokenHint) params.set('id_token_hint', idTokenHint);
  return `${keycloakConfig.endpoints.logout}?${params.toString()}`;
}
