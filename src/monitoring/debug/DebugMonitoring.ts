export class DebugMonitoring {
  private readonly debugs = new Map<string, DebugConfig>();
  private readonly manager: MonitoringManager;

  monitorDebug(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processDebug(config);
    return this.generateMonitoringReport(monitored);
  }
}
