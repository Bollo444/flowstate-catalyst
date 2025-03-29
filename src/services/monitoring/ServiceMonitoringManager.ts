export class ServiceMonitoringManager {
  private readonly monitors = new Map<string, MonitorHandler>();
  private readonly manager: MonitorManager;

  manageMonitoring(request: MonitorRequest): MonitorResult {
    const managed = this.processMonitoring(request);
    return this.generateMonitorReport(managed);
  }
}
