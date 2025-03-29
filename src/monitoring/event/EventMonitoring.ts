export class EventMonitoring {
  private readonly events = new Map<string, EventConfig>();
  private readonly manager: MonitoringManager;

  monitorEvent(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processEvent(config);
    return this.generateMonitoringReport(monitored);
  }
}
