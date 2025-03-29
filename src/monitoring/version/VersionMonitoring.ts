export class VersionMonitoring {
  private readonly versions = new Map<string, VersionConfig>();
  private readonly manager: MonitoringManager;

  monitorVersion(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processVersion(config);
    return this.generateMonitoringReport(monitored);
  }
}
