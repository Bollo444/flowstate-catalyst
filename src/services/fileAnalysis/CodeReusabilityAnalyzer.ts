export class CodeReusabilityAnalyzer {
  private readonly reusabilityMetrics = new Map<string, ReusabilityMetric>();
  private readonly analyzer: ReusabilityEngine;

  analyzeReusability(code: SourceCode): ReusabilityReport {
    const reusability = this.assessReusability(code);
    return this.generateReusabilityReport(reusability);
  }
}
