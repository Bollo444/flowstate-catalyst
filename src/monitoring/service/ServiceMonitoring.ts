export class ServiceMonitoring {
  private readonly services = new Map<string, ServiceConfig>();
  private readonly manager: MonitoringManager;

  monitorService(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processService(config);
    return this.generateMonitoringReport(monitored);
  }
}
