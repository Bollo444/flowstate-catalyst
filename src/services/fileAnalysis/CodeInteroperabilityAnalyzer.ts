export class CodeInteroperabilityAnalyzer {
  private readonly interoperabilityMetrics = new Map<
    string,
    InteroperabilityMetric
  >();
  private readonly analyzer: InteroperabilityEngine;

  analyzeInteroperability(code: SourceCode): InteroperabilityReport {
    const interoperability = this.assessInteroperability(code);
    return this.generateInteroperabilityReport(interoperability);
  }
}
