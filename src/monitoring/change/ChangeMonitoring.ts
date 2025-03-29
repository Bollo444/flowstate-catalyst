export class ChangeMonitoring {
  private readonly changes = new Map<string, ChangeConfig>();
  private readonly manager: MonitoringManager;

  monitorChange(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processChange(config);
    return this.generateMonitoringReport(monitored);
  }
}
