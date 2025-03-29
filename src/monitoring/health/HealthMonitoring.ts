export class HealthMonitoring {
  private readonly healths = new Map<string, HealthConfig>();
  private readonly manager: MonitoringManager;

  monitorHealth(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processHealth(config);
    return this.generateMonitoringReport(monitored);
  }
}
