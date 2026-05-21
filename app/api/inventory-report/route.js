import { NextResponse } from 'next/server';

// Importar dependencias
import reportRepository from '@/lib/repositories/ReportRepository';
import vaultEncryptionService from '@/lib/services/VaultEncryptionService';
import ReportReceiverService from '@/lib/services/ReportReceiverService';

// Configurar Inyección de Dependencias
const reportReceiverService = new ReportReceiverService(
  reportRepository,
  vaultEncryptionService
);

/**
 * POST /api/inventory-report
 * Controlador HTTP. Valida la petición y delega la lógica de negocio al servicio.
 */
export async function POST(request) {
  try {
    // 1. Verificar autenticación inter-sistema
    const interopAuth = request.headers.get('X-Interop-Auth');
    const expectedSecret = process.env.INTEROP_SECRET || 'dev-secret';

    if (interopAuth !== expectedSecret) {
      return NextResponse.json(
        { status: 'error', message: 'No autorizado para comunicación inter-sistema' },
        { status: 403 }
      );
    }

    // 2. Extraer payload
    const body = await request.json();
    const { encrypted_payload, metadata } = body;

    // 3. Delegar lógica de negocio al servicio
    const report = await reportReceiverService.processEncryptedReport(
      encrypted_payload,
      metadata
    );

    // 4. Formatear y enviar respuesta
    return NextResponse.json({
      status: 'success',
      data: {
        reportId: report.id,
        receivedAt: report.receivedAt,
        itemsDecrypted: report.decryptedData?.data?.totalProducts || 'N/A',
        message: 'Reporte recibido y descifrado exitosamente',
      },
    });
  } catch (err) {
    console.error('Inventory report error:', err);
    const status = err.message === 'encrypted_payload es requerido' ? 400 : 500;
    return NextResponse.json(
      { status: 'error', message: `Error procesando reporte: ${err.message}` },
      { status }
    );
  }
}

/**
 * GET /api/inventory-report
 * Retorna todos los reportes, delegando al servicio.
 */
export async function GET() {
  const reports = reportReceiverService.getAllReports();
  return NextResponse.json({
    status: 'success',
    data: {
      total: reports.length,
      reports,
    },
  });
}
