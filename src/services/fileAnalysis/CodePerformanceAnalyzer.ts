export class CodePerformanceAnalyzer {
  private readonly performanceMetrics = new Map<string, PerformanceMetric>();
  private readonly analyzer: PerformanceEngine;

  analyzePerformance(code: SourceCode): PerformanceReport {
    const performance = this.assessPerformance(code);
    return this.generatePerformanceReport(performance);
  }
}
