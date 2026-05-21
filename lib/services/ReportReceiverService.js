/**
 * ReportReceiverService
 * Contiene la lógica de negocio para recibir, descifrar y almacenar reportes.
 * Aplica Inyección de Dependencias.
 */
class ReportReceiverService {
  constructor(reportRepository, encryptionService) {
    this.reportRepository = reportRepository;
    this.encryptionService = encryptionService;
  }

  /**
   * Procesa un payload cifrado entrante.
   * @param {string} encryptedPayload 
   * @param {object} metadata 
   * @returns {Promise<object>} El reporte guardado
   */
  async processEncryptedReport(encryptedPayload, metadata) {
    if (!encryptedPayload) {
      throw new Error('encrypted_payload es requerido');
    }

    // Usar el servicio inyectado para descifrar
    const decryptedData = await this.encryptionService.decrypt(encryptedPayload);

    const report = {
      id: `RPT-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      metadata: metadata || {},
      decryptedData,
      encrypted_preview: encryptedPayload.substring(0, 60) + '...',
    };

    // Usar el repositorio inyectado para guardar
    return this.reportRepository.save(report);
  }

  /**
   * Obtiene todos los reportes recibidos.
   */
  getAllReports() {
    return this.reportRepository.findAll();
  }
}

export default ReportReceiverService;
