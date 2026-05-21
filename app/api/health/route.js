import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check para que Sistema A verifique conectividad.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'sebdom-reportes-api',
    timestamp: new Date().toISOString(),
  });
}
