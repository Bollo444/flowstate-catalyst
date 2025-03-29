export class ServiceMetricsCollector {
  private readonly collectors = new Map<string, MetricsCollector>();
  private readonly manager: MetricsManager;

  collectMetrics(service: ServiceMetrics): MetricsResult {
    const collected = this.processMetrics(service);
    return this.generateMetricsReport(collected);
  }
}
