export class StorageMonitoring {
  private readonly storages = new Map<string, StorageConfig>();
  private readonly manager: MonitoringManager;

  monitorStorage(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processStorage(config);
    return this.generateMonitoringReport(monitored);
  }
}
