/**
 * ReportRepository
 * Maneja el almacenamiento persistente de los reportes.
 * Actualmente usa un array en memoria (para la demo), pero esta
 * abstracción permite cambiar a una base de datos sin afectar el resto.
 */
class ReportRepository {
  constructor() {
    this.receivedReports = [];
  }

  save(report) {
    this.receivedReports.unshift(report);
    // Mantener solo los últimos 50
    if (this.receivedReports.length > 50) {
      this.receivedReports.length = 50;
    }
    return report;
  }

  findAll() {
    return this.receivedReports;
  }
}

// Exportamos un singleton para mantener el estado en memoria
export default new ReportRepository();
