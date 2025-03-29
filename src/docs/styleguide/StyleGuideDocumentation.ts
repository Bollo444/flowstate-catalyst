export class StyleGuideDocumentation {
  private readonly styles = new Map<string, StyleGuideDoc>();
  private readonly generator: DocGenerator;

  generateStyleGuideDoc(config: DocConfig): DocResult {
    const generated = this.processStyleGuide(config);
    return this.generateDocReport(generated);
  }
}
