export class DatabaseMonitoring {
  private readonly databases = new Map<string, DatabaseConfig>();
  private readonly manager: MonitoringManager;

  monitorDatabase(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processDatabase(config);
    return this.generateMonitoringReport(monitored);
  }
}
