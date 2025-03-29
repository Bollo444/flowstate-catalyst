export class ApiMetricsCollector {
  private readonly metrics = new Map<string, ApiMetric>();
  private readonly collector: MetricsCollector;

  collectMetrics(endpoint: string): MetricsReport {
    const collected = this.gatherMetrics(endpoint);
    return this.generateMetricsReport(collected);
  }
}
