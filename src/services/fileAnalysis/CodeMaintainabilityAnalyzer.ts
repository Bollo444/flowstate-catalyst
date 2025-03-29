export class CodeMaintainabilityAnalyzer {
  private readonly maintainabilityMetrics = new Map<
    string,
    MaintainabilityMetric
  >();
  private readonly analyzer: MaintainabilityEngine;

  analyzeMaintainability(code: SourceCode): MaintainabilityReport {
    const maintainability = this.assessMaintainability(code);
    return this.generateMaintainabilityReport(maintainability);
  }
}
