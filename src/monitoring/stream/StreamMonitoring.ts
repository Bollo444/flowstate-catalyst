export class StreamMonitoring {
  private readonly streams = new Map<string, StreamConfig>();
  private readonly manager: MonitoringManager;

  monitorStream(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processStream(config);
    return this.generateMonitoringReport(monitored);
  }
}
