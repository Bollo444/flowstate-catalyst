export class APIMonitoring {
  private readonly apis = new Map<string, APIConfig>();
  private readonly manager: MonitoringManager;

  monitorAPI(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processAPI(config);
    return this.generateMonitoringReport(monitored);
  }
}
