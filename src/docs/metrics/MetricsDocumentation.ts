export class MetricsDocumentation {
  private readonly metrics = new Map<string, MetricsDoc>();
  private readonly generator: DocGenerator;

  generateMetricsDoc(config: DocConfig): DocResult {
    const generated = this.processMetrics(config);
    return this.generateDocReport(generated);
  }
}
