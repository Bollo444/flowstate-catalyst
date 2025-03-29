export class TracingMonitoring {
  private readonly traces = new Map<string, TracingConfig>();
  private readonly manager: MonitoringManager;

  monitorTracing(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processTracing(config);
    return this.generateMonitoringReport(monitored);
  }
}
