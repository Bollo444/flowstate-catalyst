export class CodeCompatibilityAnalyzer {
  private readonly compatibilityMetrics = new Map<
    string,
    CompatibilityMetric
  >();
  private readonly analyzer: CompatibilityEngine;

  analyzeCompatibility(code: SourceCode): CompatibilityReport {
    const compatibility = this.checkCompatibility(code);
    return this.generateCompatibilityReport(compatibility);
  }
}
