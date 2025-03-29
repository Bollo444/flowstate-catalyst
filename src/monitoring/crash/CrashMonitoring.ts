export class CrashMonitoring {
  private readonly crashes = new Map<string, CrashConfig>();
  private readonly manager: MonitoringManager;

  monitorCrash(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processCrash(config);
    return this.generateMonitoringReport(monitored);
  }
}
