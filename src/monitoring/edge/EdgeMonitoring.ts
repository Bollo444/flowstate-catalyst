export class EdgeMonitoring {
  private readonly edges = new Map<string, EdgeConfig>();
  private readonly manager: MonitoringManager;

  monitorEdge(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processEdge(config);
    return this.generateMonitoringReport(monitored);
  }
}
