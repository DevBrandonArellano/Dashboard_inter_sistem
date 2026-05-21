'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sebdom-integrador';
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'sistema-b';

  function handleLogin() {
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
    });
    const authUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?${params.toString()}`;
    window.location.href = authUrl;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #1a1f35 100%)',
      padding: '1rem',
    }}>
      <div
        className="animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(26, 31, 53, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.05)',
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            borderRadius: '1rem',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
          }}>
            📊
          </div>
          <h1 style={{
            fontSize: '1.625rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            margin: 0,
          }}>
            SEBDOM Reportes
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginTop: '0.375rem',
          }}>
            Sistema B — Reportes de Inventario
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
            color: '#fca5a5',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        {/* SSO Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'var(--gradient-primary)',
            color: 'white',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Iniciar Sesión con Keycloak (SSO)
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '1rem',
        }}>
          Autenticación centralizada con 2do Factor (OTP)
        </p>

        {/* SSO Info */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          borderRadius: '0.75rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--accent-emerald)',
            fontWeight: '600',
            margin: '0 0 0.25rem',
          }}>
            🔗 Single Sign-On Activo
          </p>
          <p style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: '1.5',
          }}>
            Si ya iniciaste sesión en el Sistema A (SEBDOM), serás
            autenticado automáticamente sin necesidad de reingresar credenciales.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }}>
        Cargando...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
