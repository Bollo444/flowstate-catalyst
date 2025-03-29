export class CodeInternationalizationAnalyzer {
  private readonly i18nMetrics = new Map<string, I18nMetric>();
  private readonly analyzer: I18nEngine;

  analyzeInternationalization(code: SourceCode): I18nReport {
    const i18n = this.assessInternationalization(code);
    return this.generateI18nReport(i18n);
  }
}
