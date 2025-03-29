export class CodeCouplingAnalyzer {
  private readonly couplingMetrics = new Map<string, CouplingMetric>();
  private readonly analyzer: CouplingEngine;

  analyzeCoupling(code: SourceCode): CouplingReport {
    const coupling = this.assessCoupling(code);
    return this.generateCouplingReport(coupling);
  }
}
