'use client';

import { useState, useEffect } from 'react';

export default function DashboardClient({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch('/api/inventory-report');
      const data = await res.json();
      if (data.status === 'success') {
        setReports(data.data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }

  const latestReport = reports[0]?.decryptedData;
  const totalProducts = latestReport?.data?.totalProducts || 0;
  const totalItems = latestReport?.data?.summary?.totalItems || 0;
  const totalValue = latestReport?.data?.summary?.totalValue || 0;
  const lowStock = latestReport?.data?.summary?.lowStock || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '0.5rem',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.125rem',
          }}>📊</div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
              SEBDOM Reportes
            </h1>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>
              Sistema B — Panel de Control
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
              {user?.name || user?.email}
            </p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>
              Rol: {user?.role}
            </p>
          </div>
          <a
            href="/api/auth/logout"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              fontSize: '0.8125rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Cerrar Sesión
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Security Badge */}
        <div className="animate-fade-in-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.375rem 0.875rem', borderRadius: '2rem',
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '1.5rem',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--accent-emerald)' }}>
            Comunicación cifrada via HashiCorp Vault KMS
          </span>
        </div>

        <h2 className="animate-fade-in-up" style={{
          fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)',
          margin: '0 0 0.375rem', letterSpacing: '-0.025em',
        }}>
          Dashboard de Reportes
        </h2>
        <p className="animate-fade-in-up" style={{
          fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 2rem',
        }}>
          Reportes de inventario recibidos desde Sistema A (SEBDOM) con descifrado automático
        </p>

        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <MetricCard
            title="Productos"
            value={totalProducts}
            icon="📦"
            gradient="var(--gradient-primary)"
            delay="1"
          />
          <MetricCard
            title="Items en Stock"
            value={totalItems.toLocaleString()}
            icon="📋"
            gradient="var(--gradient-emerald)"
            delay="2"
          />
          <MetricCard
            title="Valor Total"
            value={`$${totalValue.toLocaleString()}`}
            icon="💰"
            gradient="var(--gradient-amber)"
            delay="3"
          />
          <MetricCard
            title="Stock Bajo"
            value={lowStock}
            icon="⚠️"
            gradient="var(--gradient-red)"
            delay="3"
          />
        </div>

        {/* Reports Table */}
        <div className="animate-fade-in-up-delay-3" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
                Reportes Recibidos
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                {reports.length} reporte{reports.length !== 1 ? 's' : ''} · Auto-actualización cada 15s
              </p>
            </div>
            <button
              onClick={fetchReports}
              style={{
                padding: '0.5rem 1rem', borderRadius: '0.5rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: 'var(--accent-blue)', fontSize: '0.8125rem',
                fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              ↻ Actualizar
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{
                width: '2rem', height: '2rem', margin: '0 auto 1rem',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--accent-blue)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Cargando reportes...
            </div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 0.75rem' }}>📭</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                No se han recibido reportes aún
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.375rem 0 0' }}>
                Los reportes aparecerán aquí cuando Sistema A envíe datos cifrados
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Recibido</th>
                    <th style={thStyle}>Origen</th>
                    <th style={thStyle}>Productos</th>
                    <th style={thStyle}>Estado</th>
                    <th style={thStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={tdStyle}>
                        <span style={{
                          fontFamily: 'monospace', fontSize: '0.8125rem',
                          color: 'var(--accent-blue)', fontWeight: '600',
                        }}>
                          {report.id}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {new Date(report.receivedAt).toLocaleString('es-MX')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                          padding: '0.25rem 0.625rem', borderRadius: '2rem',
                          background: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: '500',
                        }}>
                          🔒 {report.metadata?.sender || 'Sistema A'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {report.decryptedData?.data?.totalProducts || '—'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.25rem 0.625rem', borderRadius: '2rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '500',
                        }}>
                          ✓ Descifrado
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                          style={{
                            padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            color: 'var(--accent-blue)', fontSize: '0.75rem',
                            fontWeight: '500', cursor: 'pointer',
                          }}
                        >
                          {selectedReport?.id === report.id ? 'Cerrar' : 'Ver detalle'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Detail Panel */}
        {selectedReport && (
          <div className="animate-fade-in-up" style={{
            marginTop: '1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(59, 130, 246, 0.03)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
                Detalle del Reporte: {selectedReport.id}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                KMS: {selectedReport.metadata?.kms || 'HashiCorp Vault'} · 
                Algoritmo: {selectedReport.metadata?.algorithm || 'aes256-gcm96'}
              </p>
            </div>

            {/* Encrypted preview */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-red)', margin: '0 0 0.5rem' }}>
                🔐 Trama Cifrada (tal como viajó por la red):
              </p>
              <code style={{
                display: 'block', padding: '0.75rem', borderRadius: '0.5rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                fontSize: '0.75rem', color: '#fca5a5',
                wordBreak: 'break-all', fontFamily: 'monospace',
              }}>
                {selectedReport.encrypted_preview}
              </code>
            </div>

            {/* Decrypted data */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-emerald)', margin: '0 0 0.5rem' }}>
                ✅ Datos Descifrados:
              </p>

              {selectedReport.decryptedData?.data?.products && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={thStyle}>Producto</th>
                        <th style={thStyle}>Categoría</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.decryptedData.data.products.map((product, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={tdStyle}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                              {product.name}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              {product.category}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: '0.8125rem', fontWeight: '600',
                              color: product.stock < 10 ? 'var(--accent-red)' : 'var(--accent-emerald)',
                            }}>
                              {product.stock}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                              ${product.price?.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Architecture Info Footer */}
        <div className="animate-fade-in-up-delay-3" style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          <InfoItem icon="🔐" label="Identity Provider" value="Keycloak (SSO + MFA)" />
          <InfoItem icon="🔑" label="KMS" value="HashiCorp Vault Transit" />
          <InfoItem icon="🛡️" label="Cifrado" value="AES-256-GCM96" />
          <InfoItem icon="📡" label="Protocolo" value="REST + OIDC" />
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function MetricCard({ title, value, icon, gradient, delay }) {
  return (
    <div className={`animate-fade-in-up-delay-${delay}`} style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '1rem',
      padding: '1.25rem',
      transition: 'all 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>{title}</span>
        <span style={{
          width: '32px', height: '32px', borderRadius: '0.5rem',
          background: gradient, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '0.875rem',
        }}>
          {icon}
        </span>
      </div>
      <p style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
        {value}
      </p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <div>
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '0.75rem 1rem',
};
