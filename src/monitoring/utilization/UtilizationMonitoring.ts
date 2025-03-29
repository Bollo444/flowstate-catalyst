export class UtilizationMonitoring {
  private readonly utilizations = new Map<string, UtilizationConfig>();
  private readonly manager: MonitoringManager;

  monitorUtilization(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processUtilization(config);
    return this.generateMonitoringReport(monitored);
  }
}
