export class CodeTestabilityAnalyzer {
  private readonly testabilityMetrics = new Map<string, TestabilityMetric>();
  private readonly analyzer: TestabilityEngine;

  analyzeTestability(code: SourceCode): TestabilityReport {
    const testability = this.assessTestability(code);
    return this.generateTestabilityReport(testability);
  }
}
