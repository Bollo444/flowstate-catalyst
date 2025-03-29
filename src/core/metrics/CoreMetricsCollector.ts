export class CoreMetricsCollector {
  private readonly collectors = new Map<string, MetricsCollector>();
  private readonly engine: CollectorEngine;

  collectMetrics(context: MetricsContext): MetricsResult {
    const collected = this.gatherMetrics(context);
    return this.generateMetricsReport(collected);
  }
}
