export class ServerlessMonitoring {
  private readonly serverless = new Map<string, ServerlessConfig>();
  private readonly manager: MonitoringManager;

  monitorServerless(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processServerless(config);
    return this.generateMonitoringReport(monitored);
  }
}
