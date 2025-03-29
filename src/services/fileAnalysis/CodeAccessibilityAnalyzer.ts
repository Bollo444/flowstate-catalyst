export class CodeAccessibilityAnalyzer {
  private readonly accessibilityMetrics = new Map<
    string,
    AccessibilityMetric
  >();
  private readonly analyzer: AccessibilityEngine;

  analyzeAccessibility(code: SourceCode): AccessibilityReport {
    const accessibility = this.assessAccessibility(code);
    return this.generateAccessibilityReport(accessibility);
  }
}
