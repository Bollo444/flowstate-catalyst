export class CodeExtensibilityAnalyzer {
  private readonly extensibilityMetrics = new Map<
    string,
    ExtensibilityMetric
  >();
  private readonly analyzer: ExtensibilityEngine;

  analyzeExtensibility(code: SourceCode): ExtensibilityReport {
    const extensibility = this.assessExtensibility(code);
    return this.generateExtensibilityReport(extensibility);
  }
}
