export class BenchmarkMonitoring {
  private readonly benchmarks = new Map<string, BenchmarkConfig>();
  private readonly manager: MonitoringManager;

  monitorBenchmark(config: MonitoringConfig): MonitoringResult {
    const monitored = this.processBenchmark(config);
    return this.generateMonitoringReport(monitored);
  }
}
