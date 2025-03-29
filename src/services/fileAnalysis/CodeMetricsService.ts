export class CodeMetricsService {
  private readonly metrics = new Map<string, CodeMetric>();
  private readonly analyzer: MetricsAnalyzer;

  calculateMetrics(code: SourceCode): MetricsResult {
    const metrics = this.processMetrics(code);
    return this.generateMetricsReport(metrics);
  }
}
