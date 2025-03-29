export class AlertingMonitoring {
  private readonly alerts = new Map<string, AlertingConfig>();
  private readonly manager: MonitoringManager;

  monitorAlerting(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processAlerting(config);
    return this.generateMonitoringReport(monitored);
  }
}
