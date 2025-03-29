export class ErrorMonitoring {
  private readonly errors = new Map<string, ErrorConfig>();
  private readonly manager: MonitoringManager;

  monitorError(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processError(config);
    return this.generateMonitoringReport(monitored);
  }
}
