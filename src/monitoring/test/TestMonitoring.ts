export class TestMonitoring {
  private readonly tests = new Map<string, TestConfig>();
  private readonly manager: MonitoringManager;

  monitorTest(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processTest(config);
    return this.generateMonitoringReport(monitored);
  }
}
