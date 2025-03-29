export class AntiPatternDocumentation {
  private readonly antiPatterns = new Map<string, AntiPatternDoc>();
  private readonly generator: DocGenerator;

  generateAntiPatternDoc(config: DocConfig): DocResult {
    const generated = this.processAntiPattern(config);
    return this.generateDocReport(generated);
  }
}
