export class ProblemMonitoring {
  private readonly problems = new Map<string, ProblemConfig>();
  private readonly manager: MonitoringManager;

  monitorProblem(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processProblem(config);
    return this.generateMonitoringReport(monitored);
  }
}
