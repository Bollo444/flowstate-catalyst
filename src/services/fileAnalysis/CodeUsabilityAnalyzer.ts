export class CodeUsabilityAnalyzer {
  private readonly usabilityMetrics = new Map<string, UsabilityMetric>();
  private readonly analyzer: UsabilityEngine;

  analyzeUsability(code: SourceCode): UsabilityReport {
    const usability = this.assessUsability(code);
    return this.generateUsabilityReport(usability);
  }
}
