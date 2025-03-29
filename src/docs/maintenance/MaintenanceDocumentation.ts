export class MaintenanceDocumentation {
  private readonly procedures = new Map<string, MaintenanceDoc>();
  private readonly generator: DocGenerator;

  generateMaintenanceDoc(config: DocConfig): DocResult {
    const generated = this.processMaintenance(config);
    return this.generateDocReport(generated);
  }
}
