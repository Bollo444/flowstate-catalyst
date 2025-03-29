export class PatternDocumentation {
  private readonly patterns = new Map<string, PatternDoc>();
  private readonly generator: DocGenerator;

  generatePatternDoc(config: DocConfig): DocResult {
    const generated = this.processPattern(config);
    return this.generateDocReport(generated);
  }
}
