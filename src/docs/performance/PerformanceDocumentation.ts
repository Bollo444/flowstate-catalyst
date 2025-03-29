export class PerformanceDocumentation {
  private readonly metrics = new Map<string, PerformanceDoc>();
  private readonly generator: DocGenerator;

  generatePerformanceDoc(config: DocConfig): DocResult {
    const generated = this.processPerformance(config);
    return this.generateDocReport(generated);
  }
}
