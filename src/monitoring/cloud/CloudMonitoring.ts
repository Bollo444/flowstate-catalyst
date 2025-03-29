export class CloudMonitoring {
  private readonly clouds = new Map<string, CloudConfig>();
  private readonly manager: MonitoringManager;

  monitorCloud(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processCloud(config);
    return this.generateMonitoringReport(monitored);
  }
}
