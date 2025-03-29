export class CodeRobustnessAnalyzer {
  private readonly robustnessMetrics = new Map<string, RobustnessMetric>();
  private readonly analyzer: RobustnessEngine;

  analyzeRobustness(code: SourceCode): RobustnessReport {
    const robustness = this.assessRobustness(code);
    return this.generateRobustnessReport(robustness);
  }
}
