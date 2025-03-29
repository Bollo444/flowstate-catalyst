export class CodeStyleAnalyzer {
  private readonly styleRules = new Map<string, StyleRule>();
  private readonly analyzer: StyleEngine;

  analyzeStyle(code: SourceCode): StyleReport {
    const style = this.checkStyle(code);
    return this.generateStyleReport(style);
  }
}
