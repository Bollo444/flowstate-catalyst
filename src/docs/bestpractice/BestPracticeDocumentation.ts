export class BestPracticeDocumentation {
  private readonly practices = new Map<string, BestPracticeDoc>();
  private readonly generator: DocGenerator;

  generateBestPracticeDoc(config: DocConfig): DocResult {
    const generated = this.processBestPractice(config);
    return this.generateDocReport(generated);
  }
}
