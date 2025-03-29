export class CodeTestCoverageAnalyzer {
  private readonly coverageMetrics = new Map<string, CoverageMetric>();
  private readonly analyzer: CoverageEngine;

  analyzeCoverage(tests: TestFile[]): CoverageReport {
    const coverage = this.calculateCoverage(tests);
    return this.generateCoverageReport(coverage);
  }
}
