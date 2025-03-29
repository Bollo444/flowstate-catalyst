export class ExceptionMonitoring {
  private readonly exceptions = new Map<string, ExceptionConfig>();
  private readonly manager: MonitoringManager;

  monitorException(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processException(config);
    return this.generateMonitoringReport(monitored);
  }
}
