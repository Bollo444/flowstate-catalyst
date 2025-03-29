export class CodePortabilityAnalyzer {
  private readonly portabilityMetrics = new Map<string, PortabilityMetric>();
  private readonly analyzer: PortabilityEngine;

  analyzePortability(code: SourceCode): PortabilityReport {
    const portability = this.assessPortability(code);
    return this.generatePortabilityReport(portability);
  }
}
