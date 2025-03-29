export class ReleaseMonitoring {
  private readonly releases = new Map<string, ReleaseConfig>();
  private readonly manager: MonitoringManager;

  monitorRelease(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processRelease(config);
    return this.generateMonitoringReport(monitored);
  }
}
