export class CodeComplexityAnalyzer {
  private readonly complexityMetrics = new Map<string, ComplexityMetric>();
  private readonly analyzer: ComplexityEngine;

  analyzeComplexity(code: SourceCode): ComplexityReport {
    const complexity = this.calculateComplexity(code);
    return this.generateComplexityReport(complexity);
  }
}
