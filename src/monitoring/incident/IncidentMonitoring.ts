export class IncidentMonitoring {
  private readonly incidents = new Map<string, IncidentConfig>();
  private readonly manager: MonitoringManager;

  monitorIncident(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processIncident(config);
    return this.generateMonitoringReport(monitored);
  }
}
