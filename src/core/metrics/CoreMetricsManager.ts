export class CoreMetricsManager {
  private readonly metrics = new Map<string, MetricsHandler>();
  private readonly manager: MetricsManager;

  manageMetrics(request: MetricsRequest): MetricsResult {
    const managed = this.processMetrics(request);
    return this.generateMetricsReport(managed);
  }
}
