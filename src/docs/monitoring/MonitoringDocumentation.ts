export class MonitoringDocumentation {
  private readonly monitors = new Map<string, MonitoringDoc>();
  private readonly generator: DocGenerator;

  generateMonitoringDoc(config: DocConfig): DocResult {
    const generated = this.processMonitoring(config);
    return this.generateDocReport(generated);
  }
}
